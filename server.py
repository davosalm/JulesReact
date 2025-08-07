import http.server
import socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("Servidor iniciado na porta", PORT)
    print(f"Abra http://localhost:{PORT}/ no seu navegador.")
    httpd.serve_forever()
