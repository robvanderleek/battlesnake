#!/usr/bin/env node
const express = require('express');
const localtunnel = require('localtunnel');
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

const free = (snake, p) => !snake.body.some(bp => equal(p, bp));

const right = (snake, board) => snake.head.x < board.width - 1 &&
    free(snake, {x: snake.head.x + 1, y: snake.head.y});

const down = (snake, board) => snake.head.y > 0 &&
    free(snake, {x: snake.head.x, y: snake.head.y - 1});

const left = (snake, board) => snake.head.x > 0 &&
    free(snake, {x: snake.head.x - 1, y: snake.head.y});

app.post('/move', (req, res) => {
    const {turn, you: snake, board} = req.body;
    console.log(`/move called for turn: ${turn}`); 
    if (right(snake, board)) {
        res.send({'move': 'right'});
    } else if (down(snake, board)) {
        res.send({'move': 'down'});
    } else if (left(snake, board)) {
        res.send({'move': 'left'});
    } else {
        res.send({'move': 'up'});
    }
});

app.listen(port, () => { console.log(`App listening on port ${port}`); });
