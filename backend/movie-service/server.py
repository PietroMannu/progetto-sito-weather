from datetime import date
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import json
import os
from pathlib import Path
from urllib.parse import urlparse, parse_qs, quote_plus
from urllib.request import Request, urlopen
from utils.converter import tmdb_movie_to_json


def load_local_env():
    env_path = Path(__file__).resolve().parent / ".env"
    if not env_path.exists():
        return
    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


load_local_env()

PORT = int(os.environ.get("MOVIE_PORT", "3003"))
TMDB_API_KEY = os.environ.get("TMDB_API_KEY", "").strip()
PUBLIC_DIR = Path(__file__).resolve().parents[2] / "frontend" / "public"
TMDB_BASE_URL = "https://api.themoviedb.org/3"


def fetch_tmdb(endpoint, params=None):
    if not TMDB_API_KEY:
        raise RuntimeError("TMDB_API_KEY mancante in backend/movie-service/.env")

    query_parts = [f"api_key={quote_plus(TMDB_API_KEY)}"]
    if params:
        for k, v in params.items():
            query_parts.append(f"{k}={quote_plus(str(v))}")

    url = f"{TMDB_BASE_URL}{endpoint}?{'&'.join(query_parts)}"
    request = Request(
        url,
        headers={
            "Accept": "application/json",
            "User-Agent": "Movie-Service/2.0",
        },
    )

    try:
        with urlopen(request, timeout=8) as response:
            return json.load(response)
    except Exception as error:
        raise RuntimeError("Errore di comunicazione con TMDB API.") from error


def get_daily_movies():
    payload = fetch_tmdb("/trending/movie/day", {"language": "it-IT"})
    results = payload.get("results") if isinstance(payload, dict) else []
    if not isinstance(results, list) or not results:
        raise RuntimeError("Nessun film in tendenza trovato oggi.")

    # Seleziona 4 film del giorno in base alla data odierna
    offset = (date.today().toordinal() - 1) % len(results)
    rotated = results[offset:] + results[:offset]
    return [tmdb_movie_to_json(m) for m in rotated[:4] if isinstance(m, dict)]


def search_movies(query):
    payload = fetch_tmdb(
        "/search/movie",
        {
            "query": query,
            "language": "it-IT",
            "include_adult": "false",
        },
    )
    results = payload.get("results") if isinstance(payload, dict) else []
    if not isinstance(results, list):
        return []
    return [tmdb_movie_to_json(m) for m in results[:12] if isinstance(m, dict)]


def find_movie_trailer(movie_id):
    # Cerca prima in italiano, poi fallback automatico in inglese (fondamentale per film cult)
    for lang in ("it-IT", "en-US"):
        payload = fetch_tmdb(f"/movie/{movie_id}/videos", {"language": lang})
        videos = payload.get("results") if isinstance(payload, dict) else []
        if not isinstance(videos, list):
            continue

        youtube_videos = [
            v for v in videos
            if isinstance(v, dict)
            and str(v.get("site", "")).lower() == "youtube"
            and v.get("key")
        ]

        trailers = [v for v in youtube_videos if str(v.get("type", "")).lower() == "trailer"]
        teasers = [v for v in youtube_videos if str(v.get("type", "")).lower() == "teaser"]
        chosen = (trailers or teasers or youtube_videos)

        if chosen:
            video = chosen[0]
            key = video["key"]
            return {
                "found": True,
                "key": key,
                "name": video.get("name") or "Trailer Ufficiale",
                "language": lang,
                "embedUrl": f"https://www.youtube.com/embed/{key}?autoplay=1&rel=0",
            }

    return {"found": False}


class MovieHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC_DIR), **kwargs)

    def send_content(self, content, content_type, status=200):
        encoded = content.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def do_GET(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path

        if path in ("", "/"):
            self.path = "/movies.html"
            super().do_GET()
            return

        if path == "/today":
            try:
                movies = get_daily_movies()
                body = json.dumps({"results": movies}, ensure_ascii=False)
                self.send_content(body, "application/json; charset=utf-8")
            except Exception as error:
                print(f"Errore Film del Giorno: {error}", flush=True)
                body = json.dumps({"error": str(error)}, ensure_ascii=False)
                self.send_content(body, "application/json; charset=utf-8", status=500)
            return

        if path == "/search":
            params = parse_qs(parsed_url.query)
            query = (params.get("q") or [""])[0].strip()

            if not query:
                body = json.dumps({"error": "Inserisci il titolo di un film da cercare."}, ensure_ascii=False)
                self.send_content(body, "application/json; charset=utf-8", status=400)
                return

            try:
                movies = search_movies(query)
                body = json.dumps({"query": query, "count": len(movies), "results": movies}, ensure_ascii=False)
                self.send_content(body, "application/json; charset=utf-8")
            except Exception as error:
                print(f"Errore ricerca film: {error}", flush=True)
                body = json.dumps({"error": str(error)}, ensure_ascii=False)
                self.send_content(body, "application/json; charset=utf-8", status=500)
            return

        if path == "/trailer":
            params = parse_qs(parsed_url.query)
            movie_id = (params.get("id") or [""])[0].strip()

            if not movie_id.isdigit():
                body = json.dumps({"error": "ID film non valido."}, ensure_ascii=False)
                self.send_content(body, "application/json; charset=utf-8", status=400)
                return

            try:
                trailer = find_movie_trailer(movie_id)
                body = json.dumps(trailer, ensure_ascii=False)
                self.send_content(body, "application/json; charset=utf-8")
            except Exception as error:
                print(f"Errore recupero trailer: {error}", flush=True)
                body = json.dumps({"error": str(error)}, ensure_ascii=False)
                self.send_content(body, "application/json; charset=utf-8", status=500)
            return

        super().do_GET()


if __name__ == "__main__":
    print(f"Movie-service attivo su http://localhost:{PORT}", flush=True)
    ThreadingHTTPServer(("0.0.0.0", PORT), MovieHandler).serve_forever()