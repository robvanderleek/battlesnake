#!/usr/bin/env node
const http = require('http');
const PORT = 3000;

const equal = (p1, p2) => p1.x === p2.x && p1.y === p2.y;

const distance = (p1, p2) => Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

const nearestFood = (snake, food) => food.sort((f1, f2) => distance(snake.head, f1) - distance(snake.head, f2))[0]

const freeCell = (cells, c) => !cells.some(p => equal(c, p));

const snakeCells = (board) => board.snakes.flatMap(s => s.body);

const rightFree = (snake, sc, board) => snake.head.x < board.width - 1 &&
    freeCell(sc, {x: snake.head.x + 1, y: snake.head.y});

const downFree = (snake, sc) => snake.head.y > 0 &&
    freeCell(sc, {x: snake.head.x, y: snake.head.y - 1});

const leftFree = (snake, sc) => snake.head.x > 0 &&
    freeCell(sc, {x: snake.head.x - 1, y: snake.head.y});

const upFree = (snake, sc, board) => snake.head.y < board.height - 1 &&
    freeCell(sc, {x: snake.head.x, y: snake.head.y + 1});

const getDirection = (board, snake, sc) => {
    const f = nearestFood(snake, board.food);
    if (snake.head.x > f.x && leftFree(snake, sc)) {
        return 'left';
    } else if (snake.head.x < f.x && rightFree(snake, sc, board)) {
        return 'right';
    } else if (snake.head.y < f.y && upFree(snake, sc, board)) {
        return 'up';
    } else {
        return 'down';
    }
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
    const dir = getDirection(board, snake, sc);
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
