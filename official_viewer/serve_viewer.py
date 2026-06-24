from __future__ import annotations

import http.server
import socketserver
from pathlib import Path


PORT = 8017
ROOT = Path(__file__).resolve().parent


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)


class ThreadingTCPServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True


with ThreadingTCPServer(("127.0.0.1", PORT), Handler) as httpd:
    print(f"http://127.0.0.1:{PORT}/index.html")
    httpd.serve_forever()
