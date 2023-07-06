const {expect} = require("expect");
const {equal, distance, nearestFood} = require("./snake");

test('equal', () => {
    expect(equal({x: 1, y: 3}, {x: 1, y: 3})).toBeTruthy();
    expect(equal({x: 1, y: 2}, {x: 1, y: 3})).toBeFalsy();

    const p1 = {x: 3, y: 2}

    expect(equal(p1, p1)).toBeTruthy();
});

test('distance', () => {
   expect(distance({x: 3, y: 2}, {x: 4, y: 1})).toBeCloseTo(Math.sqrt(2));
});

test('nearest food', () => {
    const snake = {head: {x: 0, y: 0}}
    const food = [{x:5, y:5}, {x: 3, y: 3}, {x: 1, y:1}]

    expect(nearestFood(snake, food)).toStrictEqual({x: 1, y:1});
    expect(nearestFood(snake, [])).toBeUndefined();
    expect(nearestFood({head: {x:2, y:3}}, food)).toStrictEqual({x: 3, y:3});
})