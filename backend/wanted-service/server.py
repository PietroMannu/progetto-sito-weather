from datetime import date
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import json
import os
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from utils.converter import item_to_json

FBI_API_URL = "https://api.fbi.gov/wanted/v1/list"
PORT = int(os.environ.get("WANTED_PORT", "3002"))
PUBLIC_DIR = Path(__file__).resolve().parents[2] / "frontend" / "public"


def get_daily_item():
    request = Request(
        FBI_API_URL,
        headers={
            "Accept": "application/json",
            "User-Agent": "FBI-Wanted-Daily-Service/1.0",
        },
    )

    try:
        with urlopen(request, timeout=10) as response:
            payload = json.load(response)
    except Exception as error:
        raise RuntimeError("Impossibile contattare l'API FBI.") from error

    items = payload.get("items") if isinstance(payload, dict) else None
    if not isinstance(items, list):
        raise RuntimeError("La risposta dell'API FBI non contiene una lista valida.")

    valid_items = [item for item in items if isinstance(item, dict)]

    # preferisco chi non è stato catturato, altrimenti qualsiasi scheda
    not_captured = [i for i in valid_items
                    if str(i.get("status", "")).lower() != "captured"]
    candidates = not_captured or valid_items

    if not candidates:
        raise RuntimeError("L'API FBI non ha restituito schede disponibili.")

    # stessa scheda per tutti durante il giorno
    return candidates[(date.today().toordinal() - 1) % len(candidates)]


class WantedHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC_DIR), **kwargs)

    def send_content(self, content, content_type, status=200):
        encoded = content.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()                      # <-- era send_end_headers
        self.wfile.write(encoded)

    def do_GET(self):
        path = urlparse(self.path).path

        if path == "/":
            self.path = "/fbi.html"

        if path == "/today":                    # <-- era /api/wanted/today
            try:
                person = item_to_json(get_daily_item())
                body = json.dumps(person, ensure_ascii=False)
                self.send_content(body, "application/json; charset=utf-8")
            except Exception as error:          # <-- cattura tutto, non solo RuntimeError
                print(f"Errore API FBI: {error}", flush=True)
                body = json.dumps({"error": str(error)})
                self.send_content(body, "application/json", status=500)
            return

        super().do_GET()


if __name__ == "__main__":
    print(f"Wanted service avviato su http://localhost:{PORT}", flush=True)
    ThreadingHTTPServer(("0.0.0.0", PORT), WantedHandler).serve_forever()