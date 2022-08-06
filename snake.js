#!/usr/bin/env node
const express = require('express');
const packageJson = require('./package.json');
const {equal, nearestFood} = require("./utils");

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    console.log('/ called!');
    const response = {
        'apiversion': '1',
        'author': 'robvanderleek',
        'color': '#C00000',
        'head': 'caffeine',
        'tail': 'curled',
        'version': packageJson.version
    }
    res.send(response);
});

app.post('/start', (req, res) => {
    const body = req.body;
    console.log(`/start called for game: ${body.game.id}`);
});

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

app.post('/move', (req, res) => {
    const {turn, you: snake, board} = req.body;
    console.log(`/move called for turn: ${turn}`);
    const sc = snakeCells(board);
    const order = dirOrder(snake, board);
    console.log(order);
    const dir = go(board, snake, sc, order);
    res.send({'move': dir});
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
