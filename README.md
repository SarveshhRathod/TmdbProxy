🎬 TMDB API Proxy & Gateway Platform

A high-performance, standalone, production-ready REST API Proxy & Gateway for The Movie Database (TMDB) v3.

This gateway isolates TMDB credentials on the server side and provides:

- 🔐 Zero public API-key exposure
- 🔄 Multi-key rotation with automatic failover
- ⚡ Intelligent LRU caching
- 🛡️ Rate limiting
- 🔌 Circuit-breaker protection
- 🖼️ Integrated TMDB image proxy
- 📚 Interactive OpenAPI / Swagger documentation
- 🚀 Vercel-ready deployment

«Important: This project is an independent proxy gateway and is not affiliated with or endorsed by TMDB.»

---

📌 Base URLs

Environment| Base API URL| Image Base URL| Interactive Docs
Production| "https://tmdb-proxy-kohl-five.vercel.app/api/v1"| "https://tmdb-proxy-kohl-five.vercel.app/t/p"| "https://tmdb-proxy-kohl-five.vercel.app/docs"
Local Development| "http://localhost:3000/api/v1"| "http://localhost:3000/t/p"| "http://localhost:3000/docs"

🔒 Zero Public Credentials

Public clients do not need to provide an "api_key".

The gateway securely injects TMDB credentials server-side before forwarding requests to TMDB.

---

🚀 Features

🎬 Complete TMDB v3 Read Surface

Supports 150+ TMDB read endpoints, including:

- Movies
- TV Shows
- Seasons
- Episodes
- Search
- Discover
- Trending
- People
- Cast & Crew
- Genres
- Collections
- Production Companies
- Watch Providers
- External IDs
- Images
- Videos
- Recommendations
- Similar content

🔐 Zero API-Key Leakage

Client requests are stripped of credential parameters.

TMDB keys remain server-side and are never exposed to public clients.

🔄 Health-Aware API Key Pool

Supports multiple TMDB API keys with:

- Round-robin selection
- Automatic key rotation
- HTTP "429" cooldown handling
- Revoked/invalid key detection
- Automatic failover to healthy keys

🖼️ Integrated Image Proxy

Proxy TMDB images through your own domain:

/t/p/{size}/{file_path}

Images can be cached with long-lived immutable cache headers.

⚡ Intelligent LRU Cache

Path-based caching with configurable TTLs.

Recommended defaults:

Resource| TTL
Movie / TV Details| "1 hour"
Configuration / Genres| "24 hours"
Search / Trending| "5 minutes"
Images| "1 year"

Cache hits can return responses significantly faster than upstream requests.

🛡️ Circuit Breaker

Protects the gateway from cascading failures when the upstream TMDB service becomes unavailable.

🚦 Rate Limiting

Built-in request limiting prevents excessive usage and protects the gateway from abuse.

📚 Interactive API Documentation

Swagger / OpenAPI documentation is available at:

/docs

---

📖 API Reference

1. System & Health

Method| Endpoint| Description
"GET"| "/health"| Gateway health and circuit-breaker status
"GET"| "/api/v1"| Gateway metadata and version information
"GET"| "/docs"| Interactive Swagger / OpenAPI UI
"GET"| "/admin/providers/tmdb"| TMDB key-pool status

Admin Authentication

The admin endpoint requires:

Authorization: Bearer <ADMIN_API_KEY>

---

🎬 2. Movies

Base path:

/api/v1/movie/*

Method| Endpoint| Description
"GET"| "/api/v1/movie/{id}"| Detailed movie information
"GET"| "/api/v1/movie/{id}/credits"| Cast and crew
"GET"| "/api/v1/movie/{id}/videos"| Trailers, teasers and clips
"GET"| "/api/v1/movie/{id}/images"| Posters, backdrops and logos
"GET"| "/api/v1/movie/{id}/recommendations"| Recommended movies
"GET"| "/api/v1/movie/{id}/similar"| Similar movies
"GET"| "/api/v1/movie/{id}/reviews"| User reviews and author avatars
"GET"| "/api/v1/movie/{id}/watch/providers"| Streaming availability
"GET"| "/api/v1/movie/{id}/external_ids"| IMDb, Wikidata and other IDs
"GET"| "/api/v1/movie/{id}/release_dates"| Release dates and certifications
"GET"| "/api/v1/movie/popular"| Popular movies
"GET"| "/api/v1/movie/now_playing"| Movies currently in theatres
"GET"| "/api/v1/movie/top_rated"| Top-rated movies
"GET"| "/api/v1/movie/upcoming"| Upcoming movies

💡 "append_to_response"

Multiple related resources can be requested in a single API call.

Example:

GET /api/v1/movie/27205?append_to_response=credits,videos,images,recommendations,similar,external_ids

This reduces the number of requests required by the client.

---

📺 3. TV Shows

Base path:

/api/v1/tv/*

Method| Endpoint| Description
"GET"| "/api/v1/tv/{id}"| Complete TV series details
"GET"| "/api/v1/tv/{id}/aggregate_credits"| Complete cast and crew
"GET"| "/api/v1/tv/{id}/content_ratings"| Age certifications
"GET"| "/api/v1/tv/{id}/credits"| Cast and crew
"GET"| "/api/v1/tv/{id}/videos"| Trailers and clips
"GET"| "/api/v1/tv/{id}/images"| Posters and backdrops
"GET"| "/api/v1/tv/{id}/recommendations"| Recommended TV shows
"GET"| "/api/v1/tv/{id}/similar"| Similar TV shows
"GET"| "/api/v1/tv/{id}/watch/providers"| Streaming platforms
"GET"| "/api/v1/tv/{id}/external_ids"| IMDb, TVDB, Wikidata IDs
"GET"| "/api/v1/tv/popular"| Popular TV shows
"GET"| "/api/v1/tv/top_rated"| Top-rated TV shows
"GET"| "/api/v1/tv/airing_today"| Shows airing today
"GET"| "/api/v1/tv/on_the_air"| Shows currently on air

---

🎞️ 4. TV Seasons & Episodes

Method| Endpoint| Description
"GET"| "/api/v1/tv/{id}/season/{season_number}"| Season details and episodes
"GET"| "/api/v1/tv/{id}/season/{season_number}/credits"| Season cast and crew
"GET"| "/api/v1/tv/{id}/season/{season_number}/images"| Season images
"GET"| "/api/v1/tv/{id}/season/{season_number}/videos"| Season trailers
"GET"| "/api/v1/tv/{id}/season/{s_num}/episode/{ep_num}"| Episode details
"GET"| "/api/v1/tv/{id}/season/{s_num}/episode/{ep_num}/credits"| Guest stars and crew
"GET"| "/api/v1/tv/{id}/season/{s_num}/episode/{ep_num}/images"| Episode stills
"GET"| "/api/v1/tv/{id}/season/{s_num}/episode/{ep_num}/videos"| Episode previews and clips

---

🔎 5. Search

Base path:

/api/v1/search/*

Method| Endpoint| Query Parameters| Description
"GET"| "/api/v1/search/movie"| "query", "page", "include_adult", "year", "primary_release_year"| Search movies
"GET"| "/api/v1/search/tv"| "query", "page", "include_adult", "first_air_date_year"| Search TV shows
"GET"| "/api/v1/search/multi"| "query", "page", "include_adult"| Search movies, TV and people
"GET"| "/api/v1/search/person"| "query", "page", "include_adult"| Search people
"GET"| "/api/v1/search/collection"| "query", "page"| Search collections
"GET"| "/api/v1/search/company"| "query", "page"| Search production companies
"GET"| "/api/v1/search/keyword"| "query", "page"| Search keywords

---

🧭 6. Discover

Use advanced filters to discover movies and TV shows.

Movies

GET /api/v1/discover/movie

Common parameters:

sort_by
page
with_genres
without_genres
primary_release_year
vote_average.gte
vote_count.gte
with_original_language
with_watch_providers
watch_region

TV Shows

GET /api/v1/discover/tv

Common parameters:

sort_by
page
with_genres
first_air_date_year
vote_average.gte
with_watch_providers
watch_region

Example

GET /api/v1/discover/movie?sort_by=popularity.desc&with_genres=28,878&primary_release_year=2024&vote_average.gte=7.0

---

🔥 7. Trending & Find

Trending

GET /api/v1/trending/{media_type}/{time_window}

Supported media types:

all
movie
tv
person

Supported time windows:

day
week

Examples

GET /api/v1/trending/movie/day

GET /api/v1/trending/tv/week

Find by External ID

GET /api/v1/find/{external_id}

Example:

GET /api/v1/find/tt0816692?external_source=imdb_id

---

👤 8. People / Cast & Crew

Base path:

/api/v1/person/*

Method| Endpoint| Description
"GET"| "/api/v1/person/{id}"| Person details and biography
"GET"| "/api/v1/person/{id}/combined_credits"| Complete filmography
"GET"| "/api/v1/person/{id}/movie_credits"| Movie credits
"GET"| "/api/v1/person/{id}/tv_credits"| TV credits
"GET"| "/api/v1/person/{id}/images"| Profile images
"GET"| "/api/v1/person/{id}/external_ids"| External social/media IDs

---

🏷️ 9. Genres, Collections, Companies & Configuration

Method| Endpoint| Description
"GET"| "/api/v1/genre/movie/list"| Movie genres
"GET"| "/api/v1/genre/tv/list"| TV genres
"GET"| "/api/v1/collection/{id}"| Collection / franchise details
"GET"| "/api/v1/company/{id}"| Production company details
"GET"| "/api/v1/configuration"| TMDB configuration
"GET"| "/api/v1/configuration/countries"| ISO country codes
"GET"| "/api/v1/configuration/languages"| Supported languages

The configuration endpoint automatically rewrites image base URLs to use the proxy.

---

🖼️ 10. Image Proxy

All TMDB images can be served through the gateway:

https://tmdb-proxy-kohl-five.vercel.app/t/p/{size}/{file_path}

Supported Sizes

Category| Sizes
Poster| "w92", "w154", "w185", "w342", "w500", "w780", "original"
Backdrop| "w300", "w780", "w1280", "original"
Profile| "w45", "w185", "h632", "original"
Still| "w92", "w185", "w300", "original"
Logo| "w45", "w92", "w154", "w185", "w300", "w500", "original"

Examples

Poster

https://tmdb-proxy-kohl-five.vercel.app/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg

Backdrop

https://tmdb-proxy-kohl-five.vercel.app/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg

Profile

https://tmdb-proxy-kohl-five.vercel.app/t/p/h632/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg

---

💻 Client Integration

JavaScript / TypeScript

const BASE_URL = 'https://tmdb-proxy-kohl-five.vercel.app';

// Fetch movie details
async function getMovieDetails(movieId) {
  const res = await fetch(
    `${BASE_URL}/api/v1/movie/${movieId}?append_to_response=credits,videos,images`
  );

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  const movie = await res.json();

  console.log('Title:', movie.title);
  console.log(
    'Poster:',
    movie.poster_path
      ? `${BASE_URL}/t/p/w500${movie.poster_path}`
      : null
  );

  return movie;
}

// Search movies
async function searchMovies(query) {
  const res = await fetch(
    `${BASE_URL}/api/v1/search/movie?query=${encodeURIComponent(query)}&page=1`
  );

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}

---

Python

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
        print(
            f"🎬 {movie.get('title', 'Unknown')} "
            f"({movie.get('vote_average', 0)} ⭐)"
        )

        poster_path = movie.get("poster_path")

        if poster_path:
            print(f"   Poster: {BASE_URL}/t/p/w500{poster_path}")


get_trending_movies()

---

Flutter / Dart

import 'dart:convert';
import 'package:http/http.dart' as http;

class TmdbService {
  static const String baseUrl =
      'https://tmdb-proxy-kohl-five.vercel.app';

  static Future<Map<String, dynamic>> fetchMovie(int movieId) async {
    final response = await http.get(
      Uri.parse(
        '$baseUrl/api/v1/movie/$movieId'
        '?append_to_response=credits,videos',
      ),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }

    throw Exception(
      'Failed to load movie details: ${response.statusCode}',
    );
  }

  static String getImageUrl(
    String path, {
    String size = 'w500',
  }) {
    return '$baseUrl/t/p/$size$path';
  }
}

---

Kotlin / Android — Retrofit 2

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

---

⚙️ Environment Variables

Create a ".env" file for local development.

Variable| Required| Default| Description
"PORT"| No| "3000"| Local/server port
"NODE_ENV"| No| "production"| Runtime environment
"TMDB_ENABLED"| No| "true"| Enable TMDB provider
"TMDB_BASE_URL"| No| "https://api.themoviedb.org/3"| TMDB API host
"TMDB_KEY_1"| Yes| —| Primary TMDB API key
"TMDB_KEY_2"| No| —| Secondary API key
"TMDB_KEY_3"| No| —| Third API key
"ADMIN_API_KEY"| No| —| Admin bearer token
"RATE_LIMIT_MAX"| No| "60"| Maximum requests per window
"RATE_LIMIT_WINDOW_MS"| No| "60000"| Rate-limit window
"CACHE_ENABLED"| No| "true"| Enable in-memory LRU cache

Multiple API Keys

Additional keys can be configured:

TMDB_KEY_1=your_first_key
TMDB_KEY_2=your_second_key
TMDB_KEY_3=your_third_key

The gateway automatically rotates between available keys and can temporarily remove unhealthy keys from the active pool.

«Security: Never commit ".env" or real API keys to Git.»

---

🛠️ Local Development

1. Clone the Repository

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <PROJECT_DIRECTORY>

2. Install Dependencies

npm install

3. Configure Environment

cp .env.example .env

Add your credentials:

TMDB_KEY_1=your_tmdb_api_key

4. Start Development Server

npm run dev

The API should be available at:

http://localhost:3000

Swagger:

http://localhost:3000/docs

---

☁️ Deploy to Vercel

1. Install Vercel CLI

npm i -g vercel

2. Login

vercel login

3. Add TMDB API Key

vercel env add TMDB_KEY_1

For multiple keys:

vercel env add TMDB_KEY_2
vercel env add TMDB_KEY_3

Add your admin key:

vercel env add ADMIN_API_KEY

4. Deploy

vercel --prod

---

🔐 Security Recommendations

For production deployments:

- Never expose TMDB API keys to frontend applications.
- Never commit ".env" files.
- Use strong random values for "ADMIN_API_KEY".
- Keep admin endpoints protected.
- Configure appropriate rate limits.
- Monitor upstream failures and key health.
- Avoid exposing internal error details to clients.
- Use HTTPS in production.
- Rotate compromised API keys immediately.

Recommended ".gitignore" entries:

node_modules/
.env
.env.local
.env.production
.vercel/
*.log

---

📡 API Response Flow

Client
  │
  ▼
TMDB Proxy Gateway
  │
  ├── Rate Limiter
  │
  ├── Cache Lookup
  │
  ├── Circuit Breaker
  │
  ├── API Key Pool
  │     ├── TMDB_KEY_1
  │     ├── TMDB_KEY_2
  │     └── TMDB_KEY_3
  │
  ▼
TMDB API
  │
  ▼
Gateway Response
  │
  └── Client

---

🧠 Caching Strategy

The gateway uses path-aware caching to reduce upstream requests.

Example strategy:

Movie / TV Details     → 1 hour
Search                 → 5 minutes
Trending               → 5 minutes
Discover               → 5 minutes
Genres                 → 24 hours
Configuration          → 24 hours
Images                 → 1 year

Caching behavior can be adjusted according to deployment requirements.

---

🔄 API Key Rotation

When multiple TMDB keys are configured, the gateway maintains a health-aware key pool.

Example:

Request 1 → KEY_1
Request 2 → KEY_2
Request 3 → KEY_3
Request 4 → KEY_1
...

If a key receives a rate-limit response:

KEY_1 → HTTP 429
       ↓
Temporary cooldown
       ↓
Use KEY_2 / KEY_3

If a key is invalid or revoked:

Invalid Key
    ↓
Mark unhealthy
    ↓
Remove from active pool
    ↓
Continue using healthy keys

---

📊 Health Endpoint

Check gateway health:

GET /health

Example:

curl https://tmdb-proxy-kohl-five.vercel.app/health

The endpoint can be used by monitoring systems and deployment health checks.

---

📚 Interactive Documentation

Open Swagger UI:

https://tmdb-proxy-kohl-five.vercel.app/docs

From Swagger UI you can:

- Explore available endpoints
- View parameters
- Test requests
- Inspect responses
- Understand API schemas

---

🧪 Example Requests

Movie

curl "https://tmdb-proxy-kohl-five.vercel.app/api/v1/movie/27205"

Movie + Credits + Videos

curl "https://tmdb-proxy-kohl-five.vercel.app/api/v1/movie/27205?append_to_response=credits,videos"

Search

curl "https://tmdb-proxy-kohl-five.vercel.app/api/v1/search/movie?query=Inception"

Trending

curl "https://tmdb-proxy-kohl-five.vercel.app/api/v1/trending/movie/day"

Discover

curl "https://tmdb-proxy-kohl-five.vercel.app/api/v1/discover/movie?sort_by=popularity.desc&with_genres=28,878"

Image

curl -I "https://tmdb-proxy-kohl-five.vercel.app/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"

---

🏗️ Recommended Project Structure

.
├── api/
│   └── ...
├── src/
│   ├── routes/
│   ├── services/
│   ├── providers/
│   ├── middleware/
│   ├── cache/
│   ├── utils/
│   └── ...
├── public/
├── tests/
├── .env.example
├── .gitignore
├── package.json
├── vercel.json
└── README.md

«The exact structure may differ depending on the implementation.»

---

⚠️ Error Handling

Clients should handle common HTTP responses such as:

Status| Meaning
"200"| Successful request
"400"| Invalid request / parameters
"401"| Unauthorized
"403"| Forbidden
"404"| Resource not found
"429"| Rate limit exceeded
"500"| Gateway/internal error
"502"| Upstream TMDB failure
"503"| Service temporarily unavailable

---

📝 Notes

This gateway is designed as a standalone TMDB API proxy.

It does not require a client application to directly communicate with TMDB or expose TMDB credentials.

Clients can use the same gateway from:

- Android
- iOS
- Flutter
- React
- Next.js
- Vue
- Node.js
- Python
- PHP
- Other HTTP-compatible clients

---

⚖️ License & Terms

This project is an independent proxy gateway and is not affiliated with, sponsored by, or endorsed by The Movie Database (TMDB).

This product uses the TMDB API but is not certified by TMDB.

You are responsible for ensuring that your deployment and usage comply with:

- TMDB Terms of Use
- TMDB API policies
- Applicable copyright laws
- Applicable privacy laws
- Applicable rate-limit requirements

Please review the official TMDB policies before deploying the gateway publicly.

---

⭐ Credits

Built as an independent API gateway for applications that need a secure and simplified TMDB integration.

TMDB provides the underlying movie and TV metadata.

---

🚀 Quick Start

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <PROJECT_DIRECTORY>

npm install

cp .env.example .env

# Add your TMDB key
# TMDB_KEY_1=your_tmdb_api_key

npm run dev

Then open:

http://localhost:3000/docs

Production API:

https://tmdb-proxy-kohl-five.vercel.app/api/v1

Production Image Proxy:

https://tmdb-proxy-kohl-five.vercel.app/t/p

Production Docs:

https://tmdb-proxy-kohl-five.vercel.app/docs
