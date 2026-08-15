🎬 TMDB API Proxy & Gateway

<p align="center">
  <strong>High-Performance TMDB API Proxy & Gateway</strong>
</p><p align="center">
  Secure • Fast • Scalable • Multi-Key • Cached • Vercel Ready
</p><p align="center">
  <a href="https://tmdb-proxy-kohl-five.vercel.app/docs">
    <img src="https://img.shields.io/badge/API-Docs-8B5CF6?style=for-the-badge&logo=swagger&logoColor=white" alt="API Docs">
  </a>
  <a href="https://vercel.com">
    <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
  </a>
  <img src="https://img.shields.io/badge/TMDB-v3-01B4E4?style=for-the-badge&logo=themoviedatabase&logoColor=white" alt="TMDB v3">
  <img src="https://img.shields.io/badge/REST-API-22C55E?style=for-the-badge" alt="REST API">
</p><p align="center">
  <a href="#-features">Features</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-integration">Integration</a>
</p>---

🌐 Production

Base API URL

https://tmdb-proxy-kohl-five.vercel.app/api/v1

Image Proxy

https://tmdb-proxy-kohl-five.vercel.app/t/p

Swagger / OpenAPI

https://tmdb-proxy-kohl-five.vercel.app/docs

Health Check

https://tmdb-proxy-kohl-five.vercel.app/health

---

📖 About

TMDB API Proxy & Gateway is a standalone, production-ready REST API gateway for The Movie Database (TMDB) v3 API.

It acts as a secure layer between your application and TMDB.

┌─────────────────────┐
│      Your App       │
│ Android • Web • iOS │
└──────────┬──────────┘
           │
           ▼
┌───────────────────────────────┐
│       TMDB API Gateway        │
│                               │
│  🔐 Credential Protection     │
│  🔄 Multi-Key Rotation        │
│  ⚡ Intelligent Cache          │
│  🚦 Rate Limiting             │
│  🛡️ Circuit Breaker           │
│  🖼️ Image Proxy               │
└──────────────┬────────────────┘
               │
               ▼
       ┌───────────────┐
       │    TMDB API   │
       └───────────────┘

🔒 Zero Public Credentials

Public clients do not need to send a TMDB API key.

Example:

GET /api/v1/movie/27205

The gateway securely injects the configured TMDB credentials server-side.

«Your TMDB credentials should never be placed inside frontend or mobile application code.»

---

✨ Features

🎬 Complete TMDB v3 Read Surface

Supports a broad TMDB read-only API surface including:

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
- Companies
- Watch Providers
- External IDs
- Images
- Videos
- Reviews
- Recommendations
- Similar Content

🔐 Zero API-Key Leakage

TMDB credentials remain server-side.

Client applications communicate only with your gateway:

Client → Your Gateway → TMDB

Instead of:

Client → TMDB + exposed API key

🔄 Multi-Key Rotation

Supports multiple TMDB keys with:

- Round-robin selection
- Automatic failover
- 429 cooldown
- Invalid-key detection
- Revoked-key handling
- Health-aware key pool

⚡ Intelligent LRU Cache

Frequently requested data can be served from cache without contacting TMDB.

Default cache strategy:

- Movie / TV Details: 1 hour
- Search: 5 minutes
- Trending: 5 minutes
- Discover: 5 minutes
- Genres: 24 hours
- Configuration: 24 hours
- Images: 1 year

🚦 Rate Limiting

Protects the gateway from excessive requests and unwanted traffic.

🛡️ Circuit Breaker

Prevents repeated upstream requests when TMDB becomes temporarily unavailable.

🖼️ Image Proxy

Serve TMDB posters, backdrops, profiles, stills and logos through your own domain.

📚 Swagger / OpenAPI

Interactive API documentation is available at:

https://tmdb-proxy-kohl-five.vercel.app/docs

🚀 Vercel Ready

Designed to work with Vercel serverless deployment.

---

🔄 Multi-Key System

Configure multiple TMDB API keys:

TMDB_KEY_1=your_first_tmdb_key
TMDB_KEY_2=your_second_tmdb_key
TMDB_KEY_3=your_third_tmdb_key

The gateway maintains a pool of configured keys.

                    ┌──────────────┐
                    │   Request    │
                    └──────┬───────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   Key Pool      │
                  ├─────────────────┤
                  │ TMDB_KEY_1      │
                  │ TMDB_KEY_2      │
                  │ TMDB_KEY_3      │
                  └────────┬────────┘
                           │
                           ▼
                     Healthy Key
                           │
                           ▼
                       TMDB API

🚨 Automatic Key Failure Handling

If a key returns HTTP 429:

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

If a key becomes invalid:

Invalid / Revoked Key
          │
          ▼
   Mark Unhealthy
          │
          ▼
 Remove From Pool
          │
          ▼
Use Healthy Key

---

⚡ Cache Strategy

Resource| Default TTL
Movie Details| 1 hour
TV Details| 1 hour
Search| 5 minutes
Trending| 5 minutes
Discover| 5 minutes
Genres| 24 hours
Configuration| 24 hours
Images| 1 year

«Cache TTLs can be adjusted according to your deployment and application requirements.»

---

🛡️ Circuit Breaker

The gateway protects itself from repeated upstream failures.

Normal
  │
  ▼
Requests → TMDB
  │
  │ failures increase
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

This helps prevent unnecessary upstream traffic during temporary outages.

---

📚 API Reference

❤️ System & Health

Health

GET /health

Returns gateway health and service status.

API Metadata

GET /api/v1

Returns gateway metadata and version information.

Swagger

GET /docs

Interactive OpenAPI documentation.

Admin Provider Status

GET /admin/providers/tmdb

Requires:

Authorization: Bearer <ADMIN_API_KEY>

«Never expose the admin API key in client-side applications.»

---

🎬 Movies

Movie Details

GET /api/v1/movie/{id}

Returns detailed movie information.

Movie Credits

GET /api/v1/movie/{id}/credits

Returns cast and crew information.

Movie Videos

GET /api/v1/movie/{id}/videos

Returns trailers, teasers and clips.

Movie Images

GET /api/v1/movie/{id}/images

Returns posters, backdrops and logos.

Recommendations

GET /api/v1/movie/{id}/recommendations

Returns recommended movies.

Similar Movies

GET /api/v1/movie/{id}/similar

Returns similar movies.

Reviews

GET /api/v1/movie/{id}/reviews

Returns movie reviews.

Watch Providers

GET /api/v1/movie/{id}/watch/providers

Returns streaming availability.

External IDs

GET /api/v1/movie/{id}/external_ids

Returns external IDs such as IMDb and Wikidata.

Release Dates

GET /api/v1/movie/{id}/release_dates

Returns release dates and certifications.

Popular Movies

GET /api/v1/movie/popular

Now Playing

GET /api/v1/movie/now_playing

Top Rated

GET /api/v1/movie/top_rated

Upcoming

GET /api/v1/movie/upcoming

---

💡 Append To Response

Multiple related resources can be requested using a single API call.

GET /api/v1/movie/27205?append_to_response=credits,videos,images,recommendations,similar

This can reduce the number of network requests required by your application.

---

📺 TV Shows

TV Details

GET /api/v1/tv/{id}

Aggregate Credits

GET /api/v1/tv/{id}/aggregate_credits

Content Ratings

GET /api/v1/tv/{id}/content_ratings

Credits

GET /api/v1/tv/{id}/credits

Videos

GET /api/v1/tv/{id}/videos

Images

GET /api/v1/tv/{id}/images

Recommendations

GET /api/v1/tv/{id}/recommendations

Similar TV Shows

GET /api/v1/tv/{id}/similar

Watch Providers

GET /api/v1/tv/{id}/watch/providers

External IDs

GET /api/v1/tv/{id}/external_ids

Popular

GET /api/v1/tv/popular

Top Rated

GET /api/v1/tv/top_rated

Airing Today

GET /api/v1/tv/airing_today

On The Air

GET /api/v1/tv/on_the_air

---

🎞️ Seasons & Episodes

Season Details

GET /api/v1/tv/{id}/season/{season_number}

Returns season information and episodes.

Season Credits

GET /api/v1/tv/{id}/season/{season_number}/credits

Season Images

GET /api/v1/tv/{id}/season/{season_number}/images

Season Videos

GET /api/v1/tv/{id}/season/{season_number}/videos

Episode Details

GET /api/v1/tv/{id}/season/{s_num}/episode/{ep_num}

Episode Credits

GET /api/v1/tv/{id}/season/{s_num}/episode/{ep_num}/credits

Episode Images

GET /api/v1/tv/{id}/season/{s_num}/episode/{ep_num}/images

Episode Videos

GET /api/v1/tv/{id}/season/{s_num}/episode/{ep_num}/videos

---

🔎 Search

Search Movies

GET /api/v1/search/movie

Parameters:

query
page
include_adult
year
primary_release_year

Example:

GET /api/v1/search/movie?query=Inception&page=1

Search TV

GET /api/v1/search/tv

Parameters:

query
page
include_adult
first_air_date_year

Multi Search

GET /api/v1/search/multi

Searches:

- Movies
- TV Shows
- People

Search People

GET /api/v1/search/person

Search Collections

GET /api/v1/search/collection

Search Companies

GET /api/v1/search/company

Search Keywords

GET /api/v1/search/keyword

---

🧭 Discover

Discover movies using advanced filters.

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

Example:

GET /api/v1/discover/movie?sort_by=popularity.desc&with_genres=28,878&primary_release_year=2024&vote_average.gte=7.0

Discover TV

GET /api/v1/discover/tv

Common parameters:

sort_by
page
with_genres
first_air_date_year
vote_average.gte
with_watch_providers
watch_region

---

🔥 Trending

GET /api/v1/trending/{media_type}/{time_window}

Media Types

all
movie
tv
person

Time Windows

day
week

Examples

GET /api/v1/trending/movie/day

GET /api/v1/trending/tv/week

---

🔎 Find By External ID

GET /api/v1/find/{external_id}

Example:

GET /api/v1/find/tt0816692?external_source=imdb_id

---

👤 People

Person Details

GET /api/v1/person/{id}

Combined Credits

GET /api/v1/person/{id}/combined_credits

Movie Credits

GET /api/v1/person/{id}/movie_credits

TV Credits

GET /api/v1/person/{id}/tv_credits

Person Images

GET /api/v1/person/{id}/images

External IDs

GET /api/v1/person/{id}/external_ids

---

🏷️ Genres, Collections & Companies

Movie Genres

GET /api/v1/genre/movie/list

TV Genres

GET /api/v1/genre/tv/list

Collection

GET /api/v1/collection/{id}

Production Company

GET /api/v1/company/{id}

---

⚙️ Configuration

Main Configuration

GET /api/v1/configuration

Countries

GET /api/v1/configuration/countries

Languages

GET /api/v1/configuration/languages

The configuration response can be used by clients to understand supported TMDB configuration values.

---

🖼️ Image Proxy

The gateway can proxy TMDB images through your own domain.

https://tmdb-proxy-kohl-five.vercel.app/t/p/{size}/{file_path}

Poster Sizes

w92
w154
w185
w342
w500
w780
original

Backdrop Sizes

w300
w780
w1280
original

Profile Sizes

w45
w185
h632
original

Still Sizes

w92
w185
w300
original

Logo Sizes

w45
w92
w154
w185
w300
w500
original

Poster Example

https://tmdb-proxy-kohl-five.vercel.app/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg

Backdrop Example

https://tmdb-proxy-kohl-five.vercel.app/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg

Profile Example

https://tmdb-proxy-kohl-five.vercel.app/t/p/h632/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg

---

💻 Integration

JavaScript / TypeScript

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

---

🐍 Python

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
            print(f"Poster: {BASE_URL}/t/p/w500{poster}")


get_trending_movies()

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

Create a ".env" file for local development.

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

Variable Reference

Variable| Required| Default| Description
"PORT"| No| "3000"| Server port
"NODE_ENV"| No| "production"| Runtime environment
"TMDB_ENABLED"| No| "true"| Enable TMDB provider
"TMDB_BASE_URL"| No| TMDB v3 URL| Upstream API
"TMDB_KEY_1"| Yes| —| Primary TMDB key
"TMDB_KEY_2"| No| —| Secondary TMDB key
"TMDB_KEY_3"| No| —| Third TMDB key
"ADMIN_API_KEY"| No| —| Admin authentication key
"RATE_LIMIT_MAX"| No| "60"| Maximum requests
"RATE_LIMIT_WINDOW_MS"| No| "60000"| Rate-limit window
"CACHE_ENABLED"| No| "true"| Enable cache

«Do not commit ".env" files or real API keys to GitHub.»

---

🛠️ Installation

1. Clone Repository

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <PROJECT_DIRECTORY>

2. Install Dependencies

npm install

3. Create Environment File

cp .env.example .env

4. Configure TMDB

TMDB_KEY_1=your_tmdb_api_key

For multiple keys:

TMDB_KEY_1=your_first_key
TMDB_KEY_2=your_second_key
TMDB_KEY_3=your_third_key

5. Start Development Server

npm run dev

Open:

http://localhost:3000

Swagger:

http://localhost:3000/docs

---

☁️ Deployment

Vercel

Install Vercel CLI

npm install -g vercel

Login

vercel login

Add Environment Variables

vercel env add TMDB_KEY_1
vercel env add TMDB_KEY_2
vercel env add TMDB_KEY_3
vercel env add ADMIN_API_KEY

Deploy

vercel --prod

After deployment:

https://your-project.vercel.app

---

🔐 Security

Production security recommendations:

- ✅ Keep TMDB API keys server-side
- ✅ Never hard-code API keys in frontend code
- ✅ Never commit ".env"
- ✅ Use a strong "ADMIN_API_KEY"
- ✅ Protect "/admin/*"
- ✅ Enable rate limiting
- ✅ Use HTTPS
- ✅ Rotate compromised keys
- ✅ Avoid exposing internal errors
- ✅ Keep dependencies updated

Recommended ".gitignore"

node_modules/
.env
.env.local
.env.production
.vercel/
*.log

---

📡 HTTP Status Codes

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

                         ┌──────────────────────┐
                         │      Client App      │
                         │                      │
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

---

📁 Project Structure

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

«The exact structure may differ depending on the implementation.»

---

🧪 Quick API Test

Health

curl https://tmdb-proxy-kohl-five.vercel.app/health

Movie

curl https://tmdb-proxy-kohl-five.vercel.app/api/v1/movie/27205

Search

curl "https://tmdb-proxy-kohl-five.vercel.app/api/v1/search/movie?query=Inception"

Trending

curl https://tmdb-proxy-kohl-five.vercel.app/api/v1/trending/movie/day

Discover

curl "https://tmdb-proxy-kohl-five.vercel.app/api/v1/discover/movie?sort_by=popularity.desc&with_genres=28,878"

---

📱 Supported Clients

<p align="center">
  <img src="https://img.shields.io/badge/Android-3DDC84?style=flat-square&logo=android&logoColor=white" alt="Android">
  <img src="https://img.shields.io/badge/iOS-000000?style=flat-square&logo=apple&logoColor=white" alt="iOS">
  <img src="https://img.shields.io/badge/Web-4285F4?style=flat-square&logo=googlechrome&logoColor=white" alt="Web">
  <img src="https://img.shields.io/badge/Flutter-02569B?style=flat-square&logo=flutter&logoColor=white" alt="Flutter">
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/PHP-777BB4?style=flat-square&logo=php&logoColor=white" alt="PHP">
</p>The gateway works with any HTTP-compatible client.

---

📊 Request Flow

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
   Cache Hit?
    /       \
  YES        NO
   │          │
   ▼          ▼
Response   Key Pool
              │
              ▼
        Healthy TMDB Key
              │
              ▼
          TMDB API
              │
              ▼
        Cache Response
              │
              ▼
           Client

---

🧠 Why Use This Gateway?

Instead of implementing TMDB authentication, caching, failover, image handling and rate limiting separately in every application:

Without Gateway

App
 ├── TMDB Authentication
 ├── API Calls
 ├── Key Management
 ├── Error Handling
 ├── Caching
 ├── Rate Limiting
 └── Image URLs

With the gateway:

App
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

One integration. Multiple applications. Centralized control.

---

📚 Interactive Documentation

Open the Swagger UI:

https://tmdb-proxy-kohl-five.vercel.app/docs

You can use it to:

- Explore endpoints
- View parameters
- Send test requests
- Inspect responses
- Understand API structure

---

⚖️ Disclaimer

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

Please review TMDB's official policies before deploying this project publicly.

---

⭐ Support

If this project is useful to you, consider giving the repository a ⭐ Star on GitHub.

<p align="center">
  <strong>🎬 TMDB API Proxy & Gateway</strong>
  <br>
  <sub>Secure • Fast • Scalable • Developer Friendly</sub>
</p><p align="center">
  Made with ❤️ for developers
</p>
