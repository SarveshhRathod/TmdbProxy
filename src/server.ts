import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { LRUCache } from 'lru-cache';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config();

// ==========================================
// 1. CONFIGURATION & TYPES
// ==========================================
const CONFIG = {
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '60', 10),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  adminApiKey: process.env.ADMIN_API_KEY || 'admin-secret',
  cacheEnabled: process.env.CACHE_ENABLED !== 'false',
  cacheMax: parseInt(process.env.CACHE_MAX_ITEMS || '5000', 10),
  tmdb: {
    enabled: process.env.TMDB_ENABLED !== 'false',
    baseUrl: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
    timeout: 10000,
    keys: Object.keys(process.env)
      .filter((k) => k.startsWith('TMDB_KEY_') && process.env[k]?.trim())
      .map((k) => process.env[k]!.trim())
  }
};

type KeyStatus = 'ACTIVE' | 'COOLDOWN' | 'INVALID';

interface Credential {
  id: string;
  key: string;
  status: KeyStatus;
  failureCount: number;
  cooldownUntil: number;
  lastSuccess: number;
  lastFailure: number;
}

// ==========================================
// 2. HEALTH-AWARE CREDENTIAL POOL
// ==========================================
class CredentialPool {
  private credentials: Credential[] = [];
  private currentIndex = 0;

  constructor(keys: string[]) {
    this.credentials = keys.map((key, idx) => ({
      id: `key_${idx + 1}`,
      key,
      status: 'ACTIVE',
      failureCount: 0,
      cooldownUntil: 0,
      lastSuccess: 0,
      lastFailure: 0
    }));
  }

  public getHealthyKey(): string | null {
    const now = Date.now();
    for (const cred of this.credentials) {
      if (cred.status === 'COOLDOWN' && now >= cred.cooldownUntil) {
        cred.status = 'ACTIVE';
        cred.failureCount = 0;
      }
    }

    const activeKeys = this.credentials.filter((c) => c.status === 'ACTIVE');
    if (activeKeys.length === 0) return null;

    this.currentIndex = (this.currentIndex + 1) % activeKeys.length;
    return activeKeys[this.currentIndex].key;
  }

  public recordSuccess(key: string) {
    const cred = this.credentials.find((c) => c.key === key);
    if (cred) {
      cred.lastSuccess = Date.now();
      cred.failureCount = 0;
      cred.status = 'ACTIVE';
    }
  }

  public recordFailure(key: string, statusCode: number, retryAfterSec?: number) {
    const cred = this.credentials.find((c) => c.key === key);
    if (!cred) return;

    cred.lastFailure = Date.now();
    cred.failureCount += 1;

    if (statusCode === 401 || statusCode === 403) {
      cred.status = 'INVALID';
    } else if (statusCode === 429) {
      cred.status = 'COOLDOWN';
      const cooldownDuration = (retryAfterSec ? retryAfterSec : 30) * 1000;
      cred.cooldownUntil = Date.now() + cooldownDuration;
    } else if (cred.failureCount >= 3) {
      cred.status = 'COOLDOWN';
      cred.cooldownUntil = Date.now() + 15000; // 15s cooldown on repeated failures
    }
  }

  public getStatus() {
    return this.credentials.map((c) => ({
      id: c.id,
      status: c.status,
      failureCount: c.failureCount,
      cooldownUntil: c.cooldownUntil > 0 ? new Date(c.cooldownUntil).toISOString() : null
    }));
  }
}

const tmdbKeyPool = new CredentialPool(CONFIG.tmdb.keys);

// ==========================================
// 3. LRU CACHING SYSTEM (DYNAMIC TTLs)
// ==========================================
interface CacheEntry {
  statusCode: number;
  headers: Record<string, string>;
  data: any;
}

const memoryCache = new LRUCache<string, CacheEntry>({
  max: CONFIG.cacheMax
});

function getTtlForEndpoint(endpoint: string): number {
  if (endpoint.startsWith('/configuration') || endpoint.startsWith('/genre')) return 86400 * 1000; // 24 Hours
  if (
    endpoint.startsWith('/movie') ||
    endpoint.startsWith('/tv') ||
    endpoint.startsWith('/person') ||
    endpoint.startsWith('/collection')
  ) {
    return 3600 * 1000; // 1 Hour
  }
  return 300 * 1000; // 5 Minutes (Search, Trending, Discover)
}

// ==========================================
// 4. CIRCUIT BREAKER
// ==========================================
class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private nextAttempt = 0;

  public canRequest(): boolean {
    if (this.state === 'CLOSED') return true;
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextAttempt) {
        this.state = 'HALF_OPEN';
        return true;
      }
      return false;
    }
    return true; // HALF_OPEN
  }

  public onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  public onFailure() {
    this.failureCount += 1;
    if (this.failureCount >= 5) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + 30000; // 30s pause
    }
  }

  public getState() {
    return this.state;
  }
}

const circuitBreaker = new CircuitBreaker();

// ==========================================
// 5. SERVER CREATION & PLUGINS
// ==========================================
const app: FastifyInstance = fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    redact: ['req.headers.authorization', 'req.query.api_key']
  },
  genReqId: () => randomUUID()
});

async function bootstrap() {
  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(cors, { origin: '*' });

  await app.register(rateLimit, {
    max: CONFIG.rateLimitMax,
    timeWindow: CONFIG.rateLimitWindowMs
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Public TMDB Proxy Gateway',
        description: 'Exact TMDB v3 compatibility gateway with automatic key rotation and caching',
        version: '1.0.0'
      }
    }
  });

  await app.register(swaggerUi, { routePrefix: '/docs' });

  // Hook: Attach correlation ID
  app.addHook('onSend', async (req, reply) => {
    reply.header('X-Request-ID', req.id);
  });

  // ==========================================
  // 6. HEALTH & DISCOVERY ROUTES
  // ==========================================
  app.get('/health', async () => ({
    status: 'ok',
    uptime: process.uptime(),
    circuitBreaker: circuitBreaker.getState()
  }));

  app.get('/api/v1', async () => ({
    name: 'TMDB API v3 Compatible Gateway',
    version: '1.0.0',
    default_provider: 'tmdb',
    docs: '/docs'
  }));

  app.get('/admin/providers/tmdb', async (req: FastifyRequest, reply: FastifyReply) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${CONFIG.adminApiKey}`) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
    return {
      provider: 'tmdb',
      enabled: CONFIG.tmdb.enabled,
      circuitBreaker: circuitBreaker.getState(),
      keys: tmdbKeyPool.getStatus()
    };
  });

  // ==========================================
  // 7. TMDB PROXY HANDLER (MIRRORS ALL TMDB v3 PATHS)
  // ==========================================
  async function proxyHandler(req: FastifyRequest, reply: FastifyReply) {
    const rawPath = (req.params as { '*': string })['*'] || '';
    const cleanPath = `/${rawPath.replace(/^\/+/, '')}`;

    // Security: Strict path traversal and injection guard
    if (cleanPath.includes('..') || cleanPath.includes('://')) {
      return reply.code(400).send({
        status_code: 400,
        status_message: 'Invalid path provided.',
        success: false
      });
    }

    if (!circuitBreaker.canRequest()) {
      return reply.code(503).send({
        status_code: 503,
        status_message: 'Upstream provider is temporarily unavailable. Circuit open.',
        success: false
      });
    }

    // Clone & sanitize query params (never allow client-supplied api keys)
    const incomingQuery = { ...(req.query as Record<string, string>) };
    delete incomingQuery.api_key;
    delete incomingQuery.credential;
    delete incomingQuery.key_id;

    // Cache key construction
    const queryPairs = Object.keys(incomingQuery)
      .sort()
      .map((k) => `${k}=${encodeURIComponent(incomingQuery[k])}`)
      .join('&');
    const cacheKey = `tmdb:GET:${cleanPath}:${queryPairs}`;

    // Serve from cache if available
    if (CONFIG.cacheEnabled && req.method === 'GET') {
      const cached = memoryCache.get(cacheKey);
      if (cached) {
        reply.header('X-Cache', 'HIT');
        return reply.code(cached.statusCode).send(cached.data);
      }
    }

    // Select healthy key
    const apiKey = tmdbKeyPool.getHealthyKey();
    if (!apiKey) {
      return reply.code(503).send({
        status_code: 503,
        status_message: 'All provider credentials are exhausted or in cooldown.',
        success: false
      });
    }

    // Construct upstream URL with internal API key
    const upstreamUrl = new URL(`${CONFIG.tmdb.baseUrl}${cleanPath}`);
    Object.entries(incomingQuery).forEach(([key, val]) => {
      upstreamUrl.searchParams.set(key, val);
    });
    upstreamUrl.searchParams.set('api_key', apiKey);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.tmdb.timeout);

      const upstreamResponse = await fetch(upstreamUrl.toString(), {
        method: req.method,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TMDB-Public-Gateway/1.0'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const status = upstreamResponse.status;
      const jsonResponse = await upstreamResponse.json();

      // Upstream response evaluation
      if (upstreamResponse.ok) {
        tmdbKeyPool.recordSuccess(apiKey);
        circuitBreaker.onSuccess();

        if (CONFIG.cacheEnabled && req.method === 'GET') {
          const ttl = getTtlForEndpoint(cleanPath);
          memoryCache.set(
            cacheKey,
            { statusCode: status, headers: {}, data: jsonResponse },
            { ttl }
          );
        }

        reply.header('X-Cache', 'MISS');
        return reply.code(status).send(jsonResponse);
      } else {
        const retryAfter = upstreamResponse.headers.get('retry-after');
        const retrySec = retryAfter ? parseInt(retryAfter, 10) : undefined;

        tmdbKeyPool.recordFailure(apiKey, status, retrySec);

        if (status >= 500) {
          circuitBreaker.onFailure();
        }

        return reply.code(status).send(jsonResponse);
      }
    } catch (err: any) {
      tmdbKeyPool.recordFailure(apiKey, 500);
      circuitBreaker.onFailure();

      req.log.error(err, 'Upstream request failed');
      return reply.code(502).send({
        status_code: 502,
        status_message: 'Failed to communicate with upstream TMDB service.',
        success: false
      });
    }
  }

  // Register public proxy routes
  app.get('/api/v1/*', proxyHandler);
  app.get('/3/*', proxyHandler);

  // Start Server
  await app.listen({ port: CONFIG.port, host: CONFIG.host });
  console.log(`🚀 TMDB Gateway running at http://${CONFIG.host}:${CONFIG.port}`);
  console.log(`📖 Interactive Docs available at http://${CONFIG.host}:${CONFIG.port}/docs`);
}

bootstrap().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
