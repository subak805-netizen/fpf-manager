#!/usr/bin/env python3
"""동기화 검사용 작은 서버 (2026-09-28).
- 저장소 폴더를 그대로 보여준다(css/js 경로가 실제 앱과 같게).
- /app.html = index.html 에서 Firebase SDK 4줄을 가짜 기기(synctest/device.js)로 바꾼 것. 실제 앱 파일은 안 건드린다.
- POST /result = 검사 결과(JSON)를 받아 파일로 남긴다 → sync-check.sh 가 읽는다.
사용: python3 synctest/serve.py <포트> <결과파일>
"""
import http.server, socketserver, os, re, sys, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8790
OUT = sys.argv[2] if len(sys.argv) > 2 else '/tmp/fpf-synctest-result.json'
SDK_RE = re.compile(r'<script src="https://www\.gstatic\.com/firebasejs/[^"]+"></script>\s*')


def app_html():
    h = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
    m = SDK_RE.search(h)
    if not m:
        raise RuntimeError('Firebase SDK script tags not found in index.html')
    h = h[:m.start()] + '<script src="/synctest/device.js"></script>\n' + SDK_RE.sub('', h[m.start():])
    return h.encode('utf-8')


class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def log_message(self, *a):
        pass

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_GET(self):
        if self.path.split('?')[0] == '/app.html':
            body = app_html()
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        return super().do_GET()

    def do_POST(self):
        if self.path.startswith('/result'):
            n = int(self.headers.get('Content-Length', '0') or 0)
            data = self.rfile.read(n)
            try:
                json.loads(data.decode('utf-8'))
            except Exception:
                pass
            with open(OUT, 'wb') as f:
                f.write(data)
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(b'ok')
            return
        self.send_response(404)
        self.end_headers()


class S(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


if __name__ == '__main__':
    S(('127.0.0.1', PORT), H).serve_forever()
