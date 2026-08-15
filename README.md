# 🎬 TMDB API Proxy & Gateway

<p align="center">
  <strong>High-Performance TMDB API Proxy & Gateway</strong>
</p>
<p align="center">
  Secure • Fast • Scalable • Multi-Key • Cached • Vercel Ready
</p>
<p align="center">
  <a href="https://tmdb-proxy-kohl-five.vercel.app/docs">
    <img src="https://img.shields.io/badge/API-Docs-8B5CF6?style=for-the-badge&logo=swagger&logoColor=white" alt="API Docs">
  </a>
  <a href="https://vercel.com">
    <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
  </a>
  <img src="https://img.shields.io/badge/TMDB-v3-01B4E4?style=for-the-badge&logo=themoviedatabase&logoColor=white" alt="TMDB v3">
  <img src="https://img.shields.io/badge/REST-API-22C55E?style=for-the-badge" alt="REST API">
</p>
<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-integration">Integration</a>
</p>

---

## 🌐 Production

| Service | URL |
|---|---|
| 🚀 API | `https://tmdb-proxy-kohl-five.vercel.app/api/v1` |
| 🖼️ Image Proxy | `https://tmdb-proxy-kohl-five.vercel.app/t/p` |
| 📚 Swagger Docs | `https://tmdb-proxy-kohl-five.vercel.app/docs` |
| ❤️ Health Check | `https://tmdb-proxy-kohl-five.vercel.app/health` |

---

## 📖 About

TMDB API Proxy & Gateway is a standalone, production-ready REST API gateway for The Movie Database (TMDB) v3 API.

It provides a secure layer between your application and TMDB while adding API-key protection, multi-key rotation, caching, rate limiting, circuit-breaker protection, and image proxying.

```
Your Application
       │
       ▼
┌─────────────────────────────┐
│      TMDB API Gateway       │
├─────────────────────────────┤
│ 🔐 Credential Protection    │
│ 🔄 Multi-Key Rotation       │
│ ⚡ Intelligent Cache         │
│ 🚦 Rate Limiting            │
│ 🛡️ Circuit Breaker          │
│ 🖼️ Image Proxy              │
└──────────────┬──────────────┘
               │
               ▼
          TMDB API
```

### 🔒 Zero Public Credentials

Public clients do not need to provide a TMDB API key.

```
GET /api/v1/movie/27205
```

The gateway securely injects TMDB credentials on the server side.

> **Never expose TMDB API keys inside frontend, Android, iOS, or other public client applications.**

---

## ✨ Features

- 🎬 Complete TMDB v3 Read Surface
- 🔐 Zero API-Key Leakage
- 🔄 Multi-Key Rotation
- 🧠 Health-Aware Key Pool
- ⚡ Intelligent LRU Cache
- 🚦 Rate Limiting
- 🛡️ Circuit Breaker
- 🖼️ TMDB Image Proxy
- 📚 Interactive Swagger / OpenAPI
- 🚀 Vercel Ready
- 🔌 REST API Compatible
- 📱 Works with Android, iOS, Flutter, Web and Backend Applications

---

## 🎬 Supported TMDB Resources

The gateway provides access to a broad TMDB read-only API surface.

### Movies

- Movie details
- Credits
- Videos
- Images
- Recommendations
- Similar movies
- Reviews
- Watch providers
- External IDs
- Release dates
- Popular movies
- Now playing
- Top rated
- Upcoming

### TV

- TV details
- Aggregate credits
- Credits
- Videos
- Images
- Recommendations
- Similar shows
- Watch providers
- External IDs
- Popular
- Top rated
- Airing today
- On the air

### Other Resources

- Seasons
- Episodes
- Search
- Discover
- Trending
- People
- Genres
- Collections
- Companies
- Configuration
- External ID lookup

---

## 🔄 Multi-Key API Rotation

Configure multiple TMDB API keys:

```env
TMDB_KEY_1=your_first_tmdb_key
TMDB_KEY_2=your_second_tmdb_key
TMDB_KEY_3=your_third_tmdb_key
```

The gateway automatically manages the configured key pool.

```
                 Incoming Request
                        │
                        ▼
                 ┌──────────────┐
                 │   Key Pool   │
                 └──────┬───────┘
                        │
             ┌──────────┼──────────┐
             ▼          ▼          ▼
          KEY_1       KEY_2       KEY_3
             │          │          │
             └──────────┼──────────┘
                        │
                        ▼
                  Healthy Key
                        │
                        ▼
                    TMDB API
```

### 🚨 HTTP 429 Handling

When a key receives a rate-limit response:

```
TMDB_KEY_1
    │
    ▼
HTTP 429
    │
    ▼
Temporary Cooldown
    │
    ▼
Next Healthy Key
```

The gateway can temporarily remove the unhealthy key from active rotation.

### ❌ Invalid / Revoked Key

```
Invalid Key
    │
    ▼
Mark Unhealthy
    │
    ▼
Remove From Active Pool
    │
    ▼
Use Healthy Key
```

---

## ⚡ Intelligent Cache

The gateway uses path-aware caching to reduce unnecessary upstream requests.

| Resource | Default TTL |
|---|---|
| Movie Details | 1 hour |
| TV Details | 1 hour |
| Search | 5 minutes |
| Trending | 5 minutes |
| Discover | 5 minutes |
| Genres | 24 hours |
| Configuration | 24 hours |
| Images | 1 year |

> Cache settings can be adjusted according to your deployment requirements.

---

## 🛡️ Circuit Breaker

The gateway protects against repeated upstream failures.

```
             Normal State
                  │
                  ▼
            Requests → TMDB
                  │
                  │
           Failures Increase
                  │
                  ▼
            Circuit Open
                  │
                  ▼
        Temporary Protection
                  │
                  ▼
            Recovery Test
                  │
                  ▼
           Circuit Closed
```

This helps prevent unnecessary upstream traffic during temporary outages.

---

## 🚦 Rate Limiting

The gateway supports configurable request limiting.

Default configuration:

```env
RATE_LIMIT_MAX=60
RATE_LIMIT_WINDOW_MS=60000
```

This means a default limit of 60 requests per 60 seconds when using the default configuration.

---

## 📚 API Reference

### ❤️ System & Health

**Health Check**
```
GET /health
```
Returns gateway health and service status.

**API Metadata**
```
GET /api/v1
```
Returns gateway metadata and version information.

**Swagger / OpenAPI**
```
GET /docs
```
Interactive API documentation.

**Admin Provider Status**
```
GET /admin/providers/tmdb
```
Requires:
```
Authorization: Bearer <ADMIN_API_KEY>
```
> Never expose the admin API key in client-side applications.

---

### 🎬 Movies

| Endpoint | Description |
|---|---|
| `GET /api/v1/movie/{id}` | Movie details |
| `GET /api/v1/movie/{id}/credits` | Cast and crew |
| `GET /api/v1/movie/{id}/videos` | Trailers, teasers, clips |
| `GET /api/v1/movie/{id}/images` | Posters, backdrops, logos |
| `GET /api/v1/movie/{id}/recommendations` | Recommended movies |
| `GET /api/v1/movie/{id}/similar` | Similar movies |
| `GET /api/v1/movie/{id}/reviews` | Movie reviews |
| `GET /api/v1/movie/{id}/watch/providers` | Streaming availability |
| `GET /api/v1/movie/{id}/external_ids` | External identifiers (IMDb, Wikidata) |
| `GET /api/v1/movie/{id}/release_dates` | Release dates and certifications |
| `GET /api/v1/movie/popular` | Popular movies |
| `GET /api/v1/movie/now_playing` | Now playing |
| `GET /api/v1/movie/top_rated` | Top rated |
| `GET /api/v1/movie/upcoming` | Upcoming |

#### 💡 Append To Response

Multiple related resources can be requested through a single request.

```
GET /api/v1/movie/27205?append_to_response=credits,videos,images,recommendations,similar
```

This can reduce the number of individual requests required by the client.

---

### 📺 TV Shows

| Endpoint | Description |
|---|---|
| `GET /api/v1/tv/{id}` | TV details |
| `GET /api/v1/tv/{id}/aggregate_credits` | Aggregate credits |
| `GET /api/v1/tv/{id}/content_ratings` | Content ratings |
| `GET /api/v1/tv/{id}/credits` | Credits |
| `GET /api/v1/tv/{id}/videos` | Videos |
| `GET /api/v1/tv/{id}/images` | Images |
| `GET /api/v1/tv/{id}/recommendations` | Recommendations |
| `GET /api/v1/tv/{id}/similar` | Similar TV shows |
| `GET /api/v1/tv/{id}/watch/providers` | Watch providers |
| `GET /api/v1/tv/{id}/external_ids` | External IDs |
| `GET /api/v1/tv/popular` | Popular TV shows |
| `GET /api/v1/tv/top_rated` | Top rated TV shows |
| `GET /api/v1/tv/airing_today` | Airing today |
| `GET /api/v1/tv/on_the_air` | On the air |

---

### 🎞️ Seasons & Episodes

| Endpoint | Description |
|---|---|
| `GET /api/v1/tv/{id}/season/{season_number}` | Season details and episode data |
| `GET /api/v1/tv/{id}/season/{season_number}/credits` | Season credits |
| `GET /api/v1/tv/{id}/season/{season_number}/images` | Season images |
| `GET /api/v1/tv/{id}/season/{season_number}/videos` | Season videos |
| `GET /api/v1/tv/{id}/season/{s_num}/episode/{ep_num}` | Episode details |
| `GET /api/v1/tv/{id}/season/{s_num}/episode/{ep_num}/credits` | Episode credits |
| `GET /api/v1/tv/{id}/season/{s_num}/episode/{ep_num}/images` | Episode images |
| `GET /api/v1/tv/{id}/season/{s_num}/episode/{ep_num}/videos` | Episode videos |

---

### 🔎 Search

**Search Movies**
```
GET /api/v1/search/movie
```
Parameters: `query`, `page`, `include_adult`, `year`, `primary_release_year`

Example:
```
GET /api/v1/search/movie?query=Inception&page=1
```

**Search TV Shows**
```
GET /api/v1/search/tv
```
Parameters: `query`, `page`, `include_adult`, `first_air_date_year`

**Multi Search**
```
GET /api/v1/search/multi
```
Searches movies, TV shows and people.

**Search People**
```
GET /api/v1/search/person
```

**Search Collections**
```
GET /api/v1/search/collection
```

**Search Companies**
```
GET /api/v1/search/company
```

**Search Keywords**
```
GET /api/v1/search/keyword
```

---

### 🧭 Discover

Discover movies using advanced filters.

**Discover Movies**
```
GET /api/v1/discover/movie
```
Common parameters: `sort_by`, `page`, `with_genres`, `without_genres`, `primary_release_year`, `vote_average.gte`, `vote_count.gte`, `with_original_language`, `with_watch_providers`, `watch_region`

Example:
```
GET /api/v1/discover/movie?sort_by=popularity.desc&with_genres=28,878&primary_release_year=2024&vote_average.gte=7.0
```

**Discover TV**
```
GET /api/v1/discover/tv
```
Common parameters: `sort_by`, `page`, `with_genres`, `first_air_date_year`, `vote_average.gte`, `with_watch_providers`, `watch_region`

---

### 🔥 Trending

```
GET /api/v1/trending/{media_type}/{time_window}
```

**Supported Media Types:** `all`, `movie`, `tv`, `person`

**Supported Time Windows:** `day`, `week`

Examples:
```
GET /api/v1/trending/movie/day
GET /api/v1/trending/tv/week
```

---

### 🔎 Find By External ID

```
GET /api/v1/find/{external_id}
```

Example:
```
GET /api/v1/find/tt0816692?external_source=imdb_id
```

---

### 👤 People

| Endpoint | Description |
|---|---|
| `GET /api/v1/person/{id}` | Person details |
| `GET /api/v1/person/{id}/combined_credits` | Combined credits |
| `GET /api/v1/person/{id}/movie_credits` | Movie credits |
| `GET /api/v1/person/{id}/tv_credits` | TV credits |
| `GET /api/v1/person/{id}/images` | Person images |
| `GET /api/v1/person/{id}/external_ids` | External IDs |

---

### 🏷️ Genres, Collections & Companies

| Endpoint | Description |
|---|---|
| `GET /api/v1/genre/movie/list` | Movie genres |
| `GET /api/v1/genre/tv/list` | TV genres |
| `GET /api/v1/collection/{id}` | Collection |
| `GET /api/v1/company/{id}` | Production company |

---

### ⚙️ Configuration

| Endpoint | Description |
|---|---|
| `GET /api/v1/configuration` | Main configuration |
| `GET /api/v1/configuration/countries` | Countries |
| `GET /api/v1/configuration/languages` | Languages |

---

## 🖼️ Image Proxy

TMDB images can be served through your gateway.

```
https://tmdb-proxy-kohl-five.vercel.app/t/p/{size}/{file_path}
```

**Poster Sizes:** `w92` `w154` `w185` `w342` `w500` `w780` `original`

**Backdrop Sizes:** `w300` `w780` `w1280` `original`

**Profile Sizes:** `w45` `w185` `h632` `original`

**Still Sizes:** `w92` `w185` `w300` `original`

**Logo Sizes:** `w45` `w92` `w154` `w185` `w300` `w500` `original`

**Poster Example**
```
https://tmdb-proxy-kohl-five.vercel.app/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg
```

**Backdrop Example**
```
https://tmdb-proxy-kohl-five.vercel.app/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg
```

**Profile Example**
```
https://tmdb-proxy-kohl-five.vercel.app/t/p/h632/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg
```

---

## 💻 Integration

### JavaScript / TypeScript

```javascript
const BASE_URL = "https://tmdb-proxy-kohl-five.vercel.app";

async function getMovieDetails(movieId) {
  const response = await fetch(
    `${BASE_URL}/api/v1/movie/${movieId}?append_to_response=credits,videos,images`
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const movie = await response.json();

  console.log("Title:", movie.title);

  if (movie.poster_path) {
    console.log(
      "Poster:",
      `${BASE_URL}/t/p/w500${movie.poster_path}`
    );
  }

  return movie;
}

async function searchMovies(query) {
  const response = await fetch(
    `${BASE_URL}/api/v1/search/movie?query=${encodeURIComponent(query)}&page=1`
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}
```

### 🐍 Python

```python
import requests

BASE_URL = "https://tmdb-proxy-kohl-five.vercel.app"


def get_trending_movies():
    response = requests.get(
        f"{BASE_URL}/api/v1/trending/movie/day",
        timeout=10
    )

    response.raise_for_status()

    data = response.json()

    for movie in data.get("results", []):
        title = movie.get("title", "Unknown")
        rating = movie.get("vote_average", 0)
        poster = movie.get("poster_path")

        print(f"🎬 {title} ({rating} ⭐)")

        if poster:
            print(
                f"Poster: {BASE_URL}/t/p/w500{poster}"
            )


get_trending_movies()
```

### 🦋 Flutter / Dart

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class TmdbService {
  static const String baseUrl =
      'https://tmdb-proxy-kohl-five.vercel.app';

  static Future<Map<String, dynamic>> fetchMovie(
      int movieId) async {

    final response = await http.get(
      Uri.parse(
        '$baseUrl/api/v1/movie/$movieId'
        '?append_to_response=credits,videos',
      ),
    );

    if (response.statusCode != 200) {
      throw Exception(
        'Failed to load movie: ${response.statusCode}',
      );
    }

    return jsonDecode(response.body);
  }

  static String imageUrl(
    String path, {
    String size = 'w500',
  }) {
    return '$baseUrl/t/p/$size$path';
  }
}
```

### 🤖 Kotlin / Android

```kotlin
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

interface TmdbApiService {

    @GET("api/v1/movie/{movie_id}")
    suspend fun getMovieDetails(
        @Path("movie_id") movieId: Int,
        @Query("append_to_response")
        append: String = "credits,videos,images"
    ): MovieResponse

    @GET("api/v1/search/movie")
    suspend fun searchMovies(
        @Query("query") query: String,
        @Query("page") page: Int = 1
    ): SearchResponse
}
```

---

## ⚙️ Environment Variables

Create a `.env` file for local development.

```env
PORT=3000
NODE_ENV=production

TMDB_ENABLED=true
TMDB_BASE_URL=https://api.themoviedb.org/3

TMDB_KEY_1=your_first_tmdb_key
TMDB_KEY_2=your_second_tmdb_key
TMDB_KEY_3=your_third_tmdb_key

ADMIN_API_KEY=your_secure_admin_key

RATE_LIMIT_MAX=60
RATE_LIMIT_WINDOW_MS=60000

CACHE_ENABLED=true
```

### Variable Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3000` | Server port |
| `NODE_ENV` | No | `production` | Runtime environment |
| `TMDB_ENABLED` | No | `true` | Enable TMDB provider |
| `TMDB_BASE_URL` | No | TMDB v3 URL | Upstream API |
| `TMDB_KEY_1` | Yes | — | Primary TMDB API key |
| `TMDB_KEY_2` | No | — | Secondary TMDB API key |
| `TMDB_KEY_3` | No | — | Third TMDB API key |
| `ADMIN_API_KEY` | No | — | Admin authentication key |
| `RATE_LIMIT_MAX` | No | `60` | Maximum requests |
| `RATE_LIMIT_WINDOW_MS` | No | `60000` | Rate-limit window |
| `CACHE_ENABLED` | No | `true` | Enable cache |

> Never commit `.env` files or real API keys to GitHub.

---

## 🛠️ Installation

**1. Clone Repository**
```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <PROJECT_DIRECTORY>
```

**2. Install Dependencies**
```bash
npm install
```

**3. Create Environment File**
```bash
cp .env.example .env
```

**4. Configure TMDB**
```env
TMDB_KEY_1=your_tmdb_api_key
```

For multiple keys:
```env
TMDB_KEY_1=your_first_key
TMDB_KEY_2=your_second_key
TMDB_KEY_3=your_third_key
```

**5. Start Development Server**
```bash
npm run dev
```

Local API: `http://localhost:3000/api/v1`

Local Swagger: `http://localhost:3000/docs`

---

## ☁️ Deployment

### Vercel

Install Vercel CLI
```bash
npm install -g vercel
```

Login
```bash
vercel login
```

Add Environment Variables
```bash
vercel env add TMDB_KEY_1
vercel env add TMDB_KEY_2
vercel env add TMDB_KEY_3
vercel env add ADMIN_API_KEY
```

Deploy
```bash
vercel --prod
```

After deployment:
```
https://your-project.vercel.app
```

---

## 🔐 Security

Production security recommendations:

- ✅ Keep TMDB API keys server-side
- ✅ Never hard-code API keys in frontend code
- ✅ Never commit `.env`
- ✅ Use a strong `ADMIN_API_KEY`
- ✅ Protect `/admin/*`
- ✅ Enable rate limiting
- ✅ Use HTTPS in production
- ✅ Rotate compromised keys
- ✅ Avoid exposing internal errors
- ✅ Keep dependencies updated

**Recommended `.gitignore`**
```
node_modules/
.env
.env.local
.env.production
.vercel/
*.log
```

---

## 📡 HTTP Status Codes

| Status | Meaning |
|---|---|
| `200` | Success |
| `400` | Bad Request |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `429` | Rate Limited |
| `500` | Internal Server Error |
| `502` | Bad Gateway / Upstream Error |
| `503` | Service Unavailable |

---

## 🏗️ Architecture

```
                         ┌──────────────────────┐
                         │      Client App      │
                         │ Android • iOS • Web  │
                         │ Flutter • React etc. │
                         └──────────┬───────────┘
                                    │
                                    ▼
                    ┌─────────────────────────────┐
                    │       TMDB API Gateway      │
                    ├─────────────────────────────┤
                    │ 🔐 Credential Protection    │
                    │ 🚦 Rate Limiting            │
                    │ ⚡ LRU Cache                 │
                    │ 🛡️ Circuit Breaker          │
                    │ 🔄 Key Rotation             │
                    │ 🖼️ Image Proxy              │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │          Key Pool            │
                    ├─────────────────────────────┤
                    │ TMDB_KEY_1                  │
                    │ TMDB_KEY_2                  │
                    │ TMDB_KEY_3                  │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │          TMDB API            │
                    │     api.themoviedb.org       │
                    └─────────────────────────────┘
```

---

## 📊 Request Flow

```
Client Request
      │
      ▼
┌───────────────┐
│ Rate Limiter  │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Cache Lookup  │
└───────┬───────┘
        │
        ├──────── Cache Hit ────────► Response
        │
        ▼
┌────────────────┐
│   Key Pool     │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ Healthy Key    │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│    TMDB API    │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ Store in Cache │
└───────┬────────┘
        │
        ▼
     Client
```

---

## 📁 Project Structure

```
tmdb-api-proxy/
│
├── api/
│   └── ...
│
├── src/
│   ├── routes/
│   ├── services/
│   ├── providers/
│   ├── middleware/
│   ├── cache/
│   └── utils/
│
├── tests/
│
├── public/
│
├── .env.example
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

> The exact structure may differ depending on the implementation.

---

## 🧪 Quick API Tests

**Health**
```bash
curl https://tmdb-proxy-kohl-five.vercel.app/health
```

**Movie**
```bash
curl https://tmdb-proxy-kohl-five.vercel.app/api/v1/movie/27205
```

**Search**
```bash
curl "https://tmdb-proxy-kohl-five.vercel.app/api/v1/search/movie?query=Inception"
```

**Trending**
```bash
curl https://tmdb-proxy-kohl-five.vercel.app/api/v1/trending/movie/day
```

**Discover**
```bash
curl "https://tmdb-proxy-kohl-five.vercel.app/api/v1/discover/movie?sort_by=popularity.desc&with_genres=28,878"
```

---

## 📱 Supported Clients

<p align="center">
  <img src="https://img.shields.io/badge/Android-3DDC84?style=flat-square&logo=android&logoColor=white" alt="Android">
  <img src="https://img.shields.io/badge/iOS-000000?style=flat-square&logo=apple&logoColor=white" alt="iOS">
  <img src="https://img.shields.io/badge/Web-4285F4?style=flat-square&logo=googlechrome&logoColor=white" alt="Web">
  <img src="https://img.shields.io/badge/Flutter-02569B?style=flat-square&logo=flutter&logoColor=white" alt="Flutter">
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/PHP-777BB4?style=flat-square&logo=php&logoColor=white" alt="PHP">
</p>

Works with any HTTP-compatible client.

---

## 🧠 Why Use This Gateway?

**Without a centralized gateway:**
```
Application
├── TMDB Authentication
├── API Requests
├── API Key Management
├── Error Handling
├── Caching
├── Rate Limiting
└── Image Handling
```

**With this gateway:**
```
Application
      │
      ▼
TMDB API Gateway
      │
      ├── Authentication
      ├── Key Management
      ├── Caching
      ├── Rate Limiting
      ├── Failover
      └── Image Proxy
      │
      ▼
    TMDB
```

One integration. Centralized control. Multiple clients.

---

## 📚 Interactive Documentation

Open the Swagger UI:
```
https://tmdb-proxy-kohl-five.vercel.app/docs
```

Swagger allows you to:

- Explore API endpoints
- View request parameters
- Test API requests
- Inspect responses
- Understand the API structure

---

## ⭐ Quick Start

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <PROJECT_DIRECTORY>
npm install
cp .env.example .env
npm run dev
```

Then open: `http://localhost:3000/docs`

Production: `https://tmdb-proxy-kohl-five.vercel.app/api/v1`

---

## ⚖️ Disclaimer

This project is an independent API proxy/gateway.

This project is not affiliated with, sponsored by, or endorsed by The Movie Database (TMDB).

This project uses the TMDB API.

You are responsible for ensuring that your deployment and usage comply with:

- TMDB Terms of Use
- TMDB API policies
- Copyright requirements
- Privacy requirements
- Applicable rate limits
- Applicable laws and regulations

Please review the applicable TMDB policies before deploying this project publicly.

---

## ⭐ Support

If this project is useful to you, consider giving the repository a ⭐ Star on GitHub.

<p align="center">
  <strong>🎬 TMDB API Proxy & Gateway</strong>
  <br>
  <sub>Secure • Fast • Scalable • Developer Friendly</sub>
</p>
<p align="center">
  Made with ❤️ for developers
</p>
