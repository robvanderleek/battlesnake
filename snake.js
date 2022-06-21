#!/usr/bin/env node
const express = require('express');
const packageJson = require('./package.json');

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

const equal = (p1, p2) => p1.x === p2.x && p1.y === p2.y;

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

app.post('/move', (req, res) => {
    const {turn, you: snake, board} = req.body;
    console.log(`/move called for turn: ${turn}`); 
    const sc = snakeCells(board); 
    if (right(snake, sc, board)) {
        res.send({'move': 'right'});
    } else if (down(snake, sc)) {
        res.send({'move': 'down'});
    } else if (left(snake, sc)) {
        res.send({'move': 'left'});
    } else {
        res.send({'move': 'up'});
    }
});

app.listen(port, () => { console.log(`App listening on port ${port}`); });
