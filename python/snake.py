#!/usr/bin/env python
import json
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT=3001

def get_body(request_handler):
    content_length = int(request_handler.headers['Content-Length'])
    post_data = request_handler.rfile.read(content_length)
    return json.loads(post_data.decode('utf-8'))

def handle_get_meta_data(request_handler):
    content = json.dumps({
        'apiversion': '1',
        'author': 'robvanderleek',
        'version': '1.0',
        'color': '#3776ab',
        'head': 'safe',
        'tail': 'sharp'
    })
    request_handler.send_response(200)
    request_handler.end_headers()
    request_handler.wfile.write(content.encode('utf-8'))

def handle_game_started(request_handler):
    body = get_body(request_handler)
    game_id = body['game']['id']
    print(f'Game started: {game_id}');
    request_handler.send_response(200)
    request_handler.end_headers()

def handle_move(request_handler):
    body = get_body(request_handler)
    turn = body['turn']
    print(f'Turn: {turn}')

class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        handle_get_meta_data(self)

    def do_POST(self):
        if self.path == '/start':
            handle_game_started(self)
        elif self.path == '/move': 
            handle_move(self)

print(f'Starting Battlesnake server on port: {PORT}')
server = HTTPServer(('0.0.0.0', PORT), RequestHandler)
server.serve_forever()
