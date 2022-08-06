const equal = (p1, p2) => p1.x === p2.x && p1.y === p2.y;

const distance = (p1, p2) => Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

const nearestFood = (snake, food) => food.sort((f1, f2) => distance(snake.head, f1) - distance(snake.head, f2))[0]

module.exports = {
    equal: equal,
    distance: distance,
    nearestFood: nearestFood
}