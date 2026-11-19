import html
from urllib.parse import urlparse, quote


def safe_tmdb_url(value):
    if not isinstance(value, str) or not value.strip():
        return ""
    parsed = urlparse(value.strip())
    host = (parsed.hostname or "").lower()
    if parsed.scheme == "https" and host in ("image.tmdb.org", "www.themoviedb.org"):
        return value.strip()
    return ""


def make_fallback_poster(title):
    clean_title = html.escape((title or "Film")[:36])
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750">'
        '<rect width="500" height="750" fill="#0f172a"/>'
        '<rect x="24" y="24" width="452" height="702" rx="18" fill="#1e293b" stroke="#334155" stroke-width="2"/>'
        '<text x="250" y="350" fill="#38bdf8" font-family="sans-serif" font-size="26" font-weight="bold" text-anchor="middle">LOCANDINA NON DISPONIBILE</text>'
        f'<text x="250" y="400" fill="#e2e8f0" font-family="sans-serif" font-size="20" text-anchor="middle">{clean_title}</text>'
        "</svg>"
    )
    return "data:image/svg+xml;utf8," + quote(svg)


def tmdb_movie_to_json(movie):
    movie_id = movie.get("id")
    title = movie.get("title") or movie.get("original_title") or "Titolo non disponibile"
    original_title = movie.get("original_title") or ""
    release_date = movie.get("release_date") or ""
    year = release_date[:4] if len(release_date) >= 4 else ""

    vote = movie.get("vote_average")
    rating = f"★ {vote:.1f}" if isinstance(vote, (int, float)) and vote > 0 else ""

    poster_path = movie.get("poster_path")
    if isinstance(poster_path, str) and poster_path.startswith("/"):
        poster_card = safe_tmdb_url(f"https://image.tmdb.org/t/p/w500{poster_path}")
        poster_full = safe_tmdb_url(f"https://image.tmdb.org/t/p/original{poster_path}")
    else:
        poster_card = make_fallback_poster(title)
        poster_full = poster_card

    tmdb_page = safe_tmdb_url(f"https://www.themoviedb.org/movie/{movie_id}") if movie_id else ""

    return {
        "id": movie_id,
        "title": title,
        "originalTitle": original_title if original_title != title else "",
        "year": year,
        "rating": rating,
        "description": (movie.get("overview") or "").strip() or "Trama in italiano non ancora disponibile per questo titolo.",
        "poster": poster_card,
        "posterFull": poster_full,
        "tmdbUrl": tmdb_page,
    }