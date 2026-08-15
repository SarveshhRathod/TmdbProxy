🎬 TMDB API Proxy & Gateway

<p align="center">
  <strong>🚀 High-Performance TMDB API Proxy & Gateway</strong>
</p><p align="center">
  Secure • Fast • Scalable • Multi-Key • Cached • Vercel Ready
</p><p align="center">
  <a href="https://tmdb-proxy-kohl-five.vercel.app/docs">
    <img src="https://img.shields.io/badge/API-Docs-8B5CF6?style=for-the-badge&logo=swagger&logoColor=white" alt="API Docs">
  </a>
  <a href="https://vercel.com/">
    <img src="https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
  </a>
  <img src="https://img.shields.io/badge/TMDB-v3-01B4E4?style=for-the-badge&logo=themoviedatabase&logoColor=white" alt="TMDB v3">
  <img src="https://img.shields.io/badge/REST-API-22C55E?style=for-the-badge" alt="REST API">
</p><p align="center">
  <a href="#-features">Features</a> •
  <a href="#-api-reference">API</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-client-integration">Integration</a>
</p>---

🌐 Production

Service| URL
🚀 API| "https://tmdb-proxy-kohl-five.vercel.app/api/v1"
🖼️ Image Proxy| "https://tmdb-proxy-kohl-five.vercel.app/t/p"
📚 Swagger Docs| "https://tmdb-proxy-kohl-five.vercel.app/docs"
❤️ Health Check| "https://tmdb-proxy-kohl-five.vercel.app/health"

---

📖 About

TMDB API Proxy & Gateway is a standalone, production-ready REST API gateway for The Movie Database (TMDB) v3 API.

It sits between your application and TMDB, keeping your upstream credentials private while adding intelligent infrastructure around the API.

┌──────────────┐
│   Your App   │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│     TMDB API Gateway         │
│                              │
│  🔐 Key Protection           │
│  🔄 Key Rotation             │
│  ⚡ LRU Cache                 │
│  🚦 Rate Limiting            │
│  🛡️ Circuit Breaker          │
│  🖼️ Image Proxy              │
└──────────────┬───────────────┘
               │
               ▼
        ┌─────────────┐
        │  TMDB API   │
        └─────────────┘

🔒 Zero Public Credentials

Your frontend/client does not need to send a TMDB API key.

GET /api/v1/movie/27205

Instead, the gateway securely injects the configured TMDB credentials server-side.

---

✨ Features

Feature| Description
🎬 TMDB v3 API| 150+ read endpoints
🔐 Zero Key Leakage| TMDB credentials stay server-side
🔄 Multi-Key Rotation| Automatic API key selection & failover
🧠 Health-Aware Pool| Automatically handles unhealthy keys
⚡ LRU Cache| Fast cached responses
🚦 Rate Limiting| Protect your gateway from abuse
🛡️ Circuit Breaker| Prevent cascading upstream failures
🖼️ Image Proxy| Serve TMDB images through your domain
📚 Swagger UI| Interactive API documentation
🚀 Vercel Ready| Simple serverless deployment
🔌 REST Compatible| Works with any HTTP client

---

🔄 Multi-Key API Rotation

Configure multiple TMDB API keys:

TMDB_KEY_1=your_first_key
TMDB_KEY_2=your_second_key
TMDB_KEY_3=your_third_key

The gateway automatically rotates between available keys.

Request
   │
   ▼
┌──────────────┐
│  Key Pool    │
├──────────────┤
│ TMDB_KEY_1   │
│ TMDB_KEY_2   │
│ TMDB_KEY_3   │
└──────┬───────┘
       │
       ▼
  Healthy Key
       │
       ▼
   TMDB API

🚨 Automatic Failure Handling

If a key receives "HTTP 429":

TMDB_KEY_1
    │
    └── 429 Too Many Requests
              │
              ▼
       Temporary Cooldown
              │
              ▼
     Switch to next key

If a key becomes invalid or revoked:

Invalid / Revoked Key
          │
          ▼
   Mark as unhealthy
          │
          ▼
 Remove from active pool
          │
          ▼
Continue with healthy keys

---

⚡ Intelligent Caching

The gateway uses path-aware caching to reduce upstream requests.

Resource| Default TTL
🎬 Movie Details| 1 hour
📺 TV Details| 1 hour
🔎 Search| 5 minutes
🔥 Trending| 5 minutes
🧭 Discover| 5 minutes
🏷️ Genres| 24 hours
⚙️ Configuration| 24 hours
🖼️ Images| 1 year

---

🖼️ Image Proxy

TMDB image URLs can be served through your own gateway.

https://tmdb-proxy-kohl-five.vercel.app/t/p/{size}/{file_path}

Supported Sizes

Type| Sizes
Poster| "w92" "w154" "w185" "w342" "w500" "w780" "original"
Backdrop| "w300" "w780" "w1280" "original"
Profile| "w45" "w185" "h632" "original"
Still| "w92" "w185" "w300" "original"
Logo| "w45" "w92" "w154" "w185" "w300" "w500" "original"

Example

https://tmdb-proxy-kohl-five.vercel.app/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg

---

📚 API Reference

❤️ System

Method| Endpoint| Description
"GET"| "/health"| Gateway health
"GET"| "/api/v1"| API metadata
"GET"| "/docs"| Swagger UI
"GET"| "/admin/providers/tmdb"| Provider/key status

Admin endpoint:

Authorization: Bearer <ADMIN_API_KEY>

---

🎬 Movies

Method| Endpoint
"GET"| "/api/v1/movie/{id}"
"GET"| "/api/v1/movie/{id}/credits"
"GET"| "/api/v1/movie/{id}/videos"
"GET"| "/api/v1/movie/{id}/images"
"GET"| "/api/v1/movie/{id}/recommendations"
"GET"| "/api/v1/movie/{id}/similar"
"GET"| "/api/v1/movie/{id}/reviews"
"GET"| "/api/v1/movie/{id}/watch/providers"
"GET"| "/api/v1/movie/{id}/external_ids"
"GET"| "/api/v1/movie/{id}/release_dates"
"GET"| "/api/v1/movie/popular"
"GET"| "/api/v1/movie/now_playing"
"GET"| "/api/v1/movie/top_rated"
"GET"| "/api/v1/movie/upcoming"

"append_to_response"

Combine multiple resources into a single request:

GET /api/v1/movie/27205?append_to_response=credits,videos,images,recommendations,similar

---

📺 TV Shows

Method| Endpoint
"GET"| "/api/v1/tv/{id}"
"GET"| "/api/v1/tv/{id}/aggregate_credits"
"GET"| "/api/v1/tv/{id}/content_ratings"
"GET"| "/api/v1/tv/{id}/credits"
"GET"| "/api/v1/tv/{id}/videos"
"GET"| "/api/v1/tv/{id}/images"
"GET"| "/api/v1/tv/{id}/recommendations"
"GET"| "/api/v1/tv/{id}/similar"
"GET"| "/api/v1/tv/{id}/watch/providers"
"GET"| "/api/v1/tv/{id}/external_ids"
"GET"| "/api/v1/tv/popular"
"GET"| "/api/v1/tv/top_rated"
"GET"| "/api/v1/tv/airing_today"
"GET"| "/api/v1/tv/on_the_air"

---

🎞️ Seasons & Episodes

Method| Endpoint
"GET"| "/api/v1/tv/{id}/season/{season_number}"
"GET"| "/api/v1/tv/{id}/season/{season_number}/credits"
"GET"| "/api/v1/tv/{id}/season/{season_number}/images"
"GET"| "/api/v1/tv/{id}/season/{season_number}/videos"
"GET"| "/api/v1/tv/{id}/season/{s_num}/episode/{ep_num}"
"GET"| "/api/v1/tv/{id}/season/{s_num}/episode/{ep_num}/credits"
"GET"| "/api/v1/tv/{id}/season/{s_num}/episode/{ep_num}/images"
"GET"| "/api/v1/tv/{id}/season/{s_num}/episode/{ep_num}/videos"

---

🔎 Search

Method| Endpoint| Parameters
"GET"| "/api/v1/search/movie"| "query", "page", "year"
"GET"| "/api/v1/search/tv"| "query", "page", "first_air_date_year"
"GET"| "/api/v1/search/multi"| "query", "page", "include_adult"
"GET"| "/api/v1/search/person"| "query", "page"
"GET"| "/api/v1/search/collection"| "query", "page"
"GET"| "/api/v1/search/company"| "query", "page"
"GET"| "/api/v1/search/keyword"| "query", "page"

---

🧭 Discover

Movies

GET /api/v1/discover/movie

Supported filters include:

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

TV

GET /api/v1/discover/tv

Example:

GET /api/v1/discover/movie?sort_by=popularity.desc&with_genres=28,878&primary_release_year=2024&vote_average.gte=7.0

---

🔥 Trending

GET /api/v1/trending/{media_type}/{time_window}

Supported:

media_type:
  all
  movie
  tv
  person

time_window:
  day
  week

Example:

GET /api/v1/trending/movie/day

---

👤 People

Method| Endpoint
"GET"| "/api/v1/person/{id}"
"GET"| "/api/v1/person/{id}/combined_credits"
"GET"| "/api/v1/person/{id}/movie_credits"
"GET"| "/api/v1/person/{id}/tv_credits"
"GET"| "/api/v1/person/{id}/images"
"GET"| "/api/v1/person/{id}/external_ids"

---

🏷️ Genres, Collections & Configuration

Method| Endpoint
"GET"| "/api/v1/genre/movie/list"
"GET"| "/api/v1/genre/tv/list"
"GET"| "/api/v1/collection/{id}"
"GET"| "/api/v1/company/{id}"
"GET"| "/api/v1/configuration"
"GET"| "/api/v1/configuration/countries"
"GET"| "/api/v1/configuration/languages"

---

🔎 Find by External ID

GET /api/v1/find/{external_id}

Example:

GET /api/v1/find/tt0816692?external_source=imdb_id

---

💻 Client Integration

JavaScript / TypeScript

const BASE_URL = 'https://tmdb-proxy-kohl-five.vercel.app';

async function getMovieDetails(movieId) {
  const response = await fetch(
    `${BASE_URL}/api/v1/movie/${movieId}?append_to_response=credits,videos,images`
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const movie = await response.json();

  console.log(movie.title);

  if (movie.poster_path) {
    console.log(
      `${BASE_URL}/t/p/w500${movie.poster_path}`
    );
  }

  return movie;
}

async function searchMovies(query) {
  const response = await fetch(
    `${BASE_URL}/api/v1/search/movie?query=${encodeURIComponent(query)}`
  );

  return response.json();
}

---

🐍 Python

import requests

BASE_URL = "https://tmdb-proxy-kohl-five.vercel.app"

response = requests.get(
    f"{BASE_URL}/api/v1/trending/movie/day",
    timeout=10
)

response.raise_for_status()

data = response.json()

for movie in data.get("results", []):
    print(
        movie.get("title"),
        movie.get("vote_average")
    )

---

🦋 Flutter / Dart

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
      throw Exception('Failed to load movie');
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

---

🤖 Kotlin / Android

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

Variable| Required| Default
"PORT"| No| "3000"
"NODE_ENV"| No| "production"
"TMDB_ENABLED"| No| "true"
"TMDB_BASE_URL"| No| TMDB v3
"TMDB_KEY_1"| Yes| —
"TMDB_KEY_2"| No| —
"TMDB_KEY_3"| No| —
"ADMIN_API_KEY"| No| —
"RATE_LIMIT_MAX"| No| "60"
"RATE_LIMIT_WINDOW_MS"| No| "60000"
"CACHE_ENABLED"| No| "true"

---

🛠️ Installation

1. Clone

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <PROJECT_DIRECTORY>

2. Install Dependencies

npm install

3. Create Environment File

cp .env.example .env

4. Add TMDB Key

TMDB_KEY_1=your_tmdb_api_key

5. Start Development

npm run dev

Open:

http://localhost:3000/docs

---

☁️ Deployment

Vercel

Install the CLI:

npm install -g vercel

Login:

vercel login

Add environment variables:

vercel env add TMDB_KEY_1
vercel env add TMDB_KEY_2
vercel env add TMDB_KEY_3
vercel env add ADMIN_API_KEY

Deploy:

vercel --prod

---

🔐 Security

«Never expose your TMDB API keys in frontend/client-side code.»

Recommended:

- ✅ Keep credentials in environment variables
- ✅ Use a strong "ADMIN_API_KEY"
- ✅ Enable rate limiting
- ✅ Use HTTPS in production
- ✅ Rotate compromised keys
- ✅ Protect "/admin/*"
- ✅ Never commit ".env"
- ✅ Avoid exposing internal server errors

".gitignore"

node_modules/
.env
.env.local
.env.production
.vercel/
*.log

---

📡 Error Codes

Status| Meaning
"200"| Success
"400"| Bad Request
"401"| Unauthorized
"403"| Forbidden
"404"| Not Found
"429"| Rate Limited
"500"| Internal Server Error
"502"| Bad Gateway / Upstream Error
"503"| Service Unavailable

---

🏗️ Architecture

                         ┌─────────────────┐
                         │   Client App    │
                         │ Android / Web   │
                         │ Flutter / iOS   │
                         └────────┬────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │    TMDB API Gateway    │
                    ├─────────────────────────┤
                    │ 🔐 Authentication       │
                    │ 🚦 Rate Limiter         │
                    │ ⚡ LRU Cache             │
                    │ 🛡️ Circuit Breaker      │
                    │ 🔄 Key Rotation         │
                    │ 🖼️ Image Proxy          │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │       Key Pool           │
                    ├─────────────────────────┤
                    │ TMDB_KEY_1              │
                    │ TMDB_KEY_2              │
                    │ TMDB_KEY_3              │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │       TMDB API           │
                    │    api.themoviedb.org    │
                    └─────────────────────────┘

---

📁 Suggested Structure

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

---

🧪 Quick Test

Health

curl https://tmdb-proxy-kohl-five.vercel.app/health

Movie

curl https://tmdb-proxy-kohl-five.vercel.app/api/v1/movie/27205

Search

curl "https://tmdb-proxy-kohl-five.vercel.app/api/v1/search/movie?query=Inception"

Trending

curl https://tmdb-proxy-kohl-five.vercel.app/api/v1/trending/movie/day

---

📊 Supported Platforms

<p align="center"><img src="https://img.shields.io/badge/Android-3DDC84?style=flat-square&logo=android&logoColor=white">
<img src="https://img.shields.io/badge/iOS-000000?style=flat-square&logo=apple&logoColor=white">
<img src="https://img.shields.io/badge/Web-4285F4?style=flat-square&logo=googlechrome&logoColor=white">
<img src="https://img.shields.io/badge/Flutter-02569B?style=flat-square&logo=flutter&logoColor=white">
<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black">
<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white">
<img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white">
<img src="https://img.shields.io/badge/PHP-777BB4?style=flat-square&logo=php&logoColor=white"></p>---

⚖️ Disclaimer

This project is an independent API proxy/gateway.

It is not affiliated with, sponsored by, or endorsed by The Movie Database (TMDB).

This project uses the TMDB API and you are responsible for complying with the applicable:

- TMDB Terms of Use
- TMDB API policies
- Copyright requirements
- Privacy requirements
- Rate limits
- Applicable laws and regulations

Please review TMDB's official policies before using this project in production.

---

⭐ Support

If this project is useful to you, consider giving the repository a ⭐ on GitHub.

<p align="center">Built for developers who want a clean, secure and fast TMDB integration.

<br>🎬 TMDB API Proxy & Gateway

</p>---

<p align="center">
  <sub>Made with ❤️ for developers</sub>
</p>
