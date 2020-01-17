const grid = [
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [1, 0, 0, 0, 0]
];
const goal = [4, 4];
const player = [0, 0];
const margin = 3;
const qtable = {};
for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        qtable[[i, j]] = [0, 0, 0, 0]
    }
}
const applyAction = (state, dir) => {
    const player = [...state];
    if (dir === 0 && player[1] > 0) {
        player[1] -= 1;
    } else if (dir === 1 && player[0] < 4) {
        player[0] += 1;
    } else if (dir === 2 && player[1] < 4) {
        player[1] += 1;
    } else if (dir === 3 && player[0] > 0) {
        player[0] -= 1;
    }
    grid.forEach((row, i) => {
        row.forEach((space, j) => {
            if (space === 1 && player[1] === i && player[0] === j) {
                episode += 1;
                epsilon *= epsilonDecay;
                learningRate *= learningDecay;
                player[0] = 0;
                player[1] = 0;
            }
        })
    })
    return player;
}
const movePlayer = (dir) => {
    if (dir === 0 && player[1] > 0) {
        player[1] -= 1;
    } else if (dir === 1 && player[0] < 4) {
        player[0] += 1;
    } else if (dir === 2 && player[1] < 4) {
        player[1] += 1;
    } else if (dir === 3 && player[0] > 0) {
        player[0] -= 1;
    }
    grid.forEach((row, i) => {
        row.forEach((space, j) => {
            if (space === 1 && player[1] === i && player[0] === j) {
                episode += 1;
                epsilon *= epsilonDecay;
                learningRate *= learningDecay;
                player[0] = 0;
                player[1] = 0;
            }
        })
    })
    if (!tilesVisited.includes(player.toString())) {
        tilesVisited.push(player.toString());
    }
}
let episode = 1;
let epsilon = 1;
let epsilonDecay = 0.999;
let learningDecay = 1;
let learningRate = 0.1;
let discountRate = 0.9;
const chooseAction = () => {
    const scores = qtable[player];
    let choice;
    if (Math.random() <= epsilon) {
        choice = Math.floor(Math.random() * scores.length);
    } else {
        const max = Math.max(...scores);
        const index = scores.findIndex(score => score === max);
        choice = index;
    }
    scores[choice] += learningRate * reward(player, choice, scores[choice]);
    return choice;
}
const reward = (state, action, currValue) => {
    const newState = applyAction(state, action);
    const actions = [0, 1, 2, 3];
    const highestReward = Math.max(...actions.map(action => basicReward(newState, action)));
    return basicReward(state, action) + discountRate * highestReward - currValue;
}
const tilesVisited = ["0,0"];
const basicReward = (state, action) => {
    const distance = dist(state[0], state[1], goal[0], goal[1]);
    const newState = applyAction(state, action);
    const newDistance = dist(newState[0], newState[1], goal[0], goal[1]);
    return (distance - newDistance) * ((tilesVisited.includes(newState.toString())) ? 1 : 10) + ((newState.toString() === goal.toString()) ? 1000 : 0);
}

function setup() {
    createCanvas(500 + margin, 500 + margin)
}
let iter = 0;

function draw() {
    background(255);
    stroke(0);
    strokeWeight(1);
    fill(255);
    rect(0, 0, width, height);
    noStroke();
    iter++;
    if (iter % 1 === 0) {
        movePlayer(chooseAction());
    }
    let pos = [0, 0];
    let i = 0;
    while (qtable[pos].toString() !== "0,0,0,0" && i < 20) {
        const max = Math.max(...qtable[pos]);
        const action = qtable[pos].findIndex(score => score === max);
        const newPos = applyAction(pos, action);
        stroke(3)
        line(pos[0] * 100 + margin, pos[1] * 100 + margin, newPos[0] * 100 + margin, newPos[1] * 100 + margin);
        noStroke();
        if (newPos.toString() === pos.toString()) {
            break;
        }
        let dead = false;
        grid.forEach((row, i) => {
            row.forEach((space, j) => {
                if (space === 1 && newPos[1] === i && newPos[0] === j) {
                    dead = true;
                }
            })
        });
        if (dead) {
            break;
        }
        pos = newPos;
        i++;
    }
    //}
    /*if (player[0] === goal[0] && player[1] === goal[1]) {
        noLoop();
    }*/
    grid.forEach((row, i) => {
        row.forEach((space, j) => {
            if (space === 1) {
                fill(0)
                rect(j * 100 + margin, i * 100 + margin, 100, 100)
            }
        })
    })
    fill(0, 0, 255);
    rect(goal[0] * 100 + margin, goal[1] * 100 + margin, 100, 100);
    fill(0, 255, 0);
    rect(player[0] * 100 + margin, player[1] * 100 + margin, 100, 100);
}