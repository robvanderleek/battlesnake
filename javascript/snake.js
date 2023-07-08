#!/usr/bin/env node
const http = require('http');
const PORT = 3000;

const equal = (p1, p2) => p1.x === p2.x && p1.y === p2.y;

const distance = (p1, p2) => Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

const nearestFood = (snake, food) => food.sort((f1, f2) => distance(snake.head, f1) - distance(snake.head, f2))[0]

const freeCell = (cells, c) => !cells.some(p => equal(c, p));

const snakeCells = (board) => {
    let result = [];
    for (const s of board.snakes) {
        result = result.concat(s.body);
    }
    return result;
}

const right = (snake, sc, board) => snake.head.x < board.width - 1 &&
    freeCell(sc, {x: snake.head.x + 1, y: snake.head.y});

const down = (snake, sc) => snake.head.y > 0 &&
    freeCell(sc, {x: snake.head.x, y: snake.head.y - 1});

const left = (snake, sc) => snake.head.x > 0 &&
    freeCell(sc, {x: snake.head.x - 1, y: snake.head.y});

const up = (snake, sc, board) => snake.head.y < board.height - 1 &&
    freeCell(sc, {x: snake.head.x, y: snake.head.y + 1});

const go = (board, snake, sc, directions) => {
    for (const d of directions) {
        if (d === 'right' && right(snake, sc, board)) {
            return 'right';
        }
        if (d === 'down' && down(snake, sc)) {
            return 'down';
        }
        if (d === 'left' && left(snake, sc)) {
            return 'left';
        }
        if (d === 'up' && up(snake, sc, board)) {
            return 'up';
        }
    }
}

const dirOrder = (snake, board) => {
    const f = nearestFood(snake, board.food);
    let order = ['right', 'down', 'left', 'up'];
    if (f) {
        if (snake.head.x > f.x) {
            order[0] = 'left';
            order[2] = 'right';
        }
        if (snake.head.y < f.y) {
            order[1] = 'up';
            order[3] = 'down';
        }
        if (snake.head.x === f.x) {
            order = [order[1], order[3], order[0], order[2]]
        }
    }
    return order;
}

const handleGetMetaData = (req, res) => {
    const response = {
        'apiversion': '1',
        'author': 'robvanderleek',
        'color': '#C00000',
        'head': 'caffeine',
        'tail': 'curled',
        'version': '1.0'
    }
    res.end(JSON.stringify(response));
}

const handleWithBody = (req, res, handler) => {
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        handler(req, res, JSON.parse(body));
    });
}

const handleGameStart = (req, res, body) => {
    console.log(`Game started: ${body.game.id}`);
    res.writeHead(200);
}

const handleMove = (req, res, body) => {
    const {turn, you: snake, board} = body;
    console.log(`/move called for turn: ${turn}`);
    const sc = snakeCells(board);
    const order = dirOrder(snake, board);
    const dir = go(board, snake, sc, order);
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(`{"move": "${dir}"}`);
}

const requestHandler = (req, res) => {
    if (req.url === '/') {
        handleGetMetaData(req, res);
    } else if (req.url === '/start') {
        handleWithBody(req, res, handleGameStart);
    } else if (req.url === '/move') {
        handleWithBody(req, res, handleMove);
    }
}

const server = http.createServer(requestHandler);
server.listen(PORT, '0.0.0.0', 
    () => console.log(`Battlesnake server running on port: ${PORT}`));
