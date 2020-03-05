let data = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 1],
    [4, 1],
    [5, 1]
];
data.sort(() => Math.random() - 0.5);
let k = -1;
let x0 = 0;
let learningRate = 0.01;
let iteration = 0;

while (true) {
    const kNudges = [];
    const x0Nudges = [];
    const costs = [];
    data.forEach(([x, expectedOutput]) => {
        const output = 1 / (1 + Math.exp(k * (x - x0)));
        const cost = ((output - expectedOutput) ** 2) / 2;
        costs.push(cost);
        kNudges.push((
            ((x0 - x) * Math.exp(k * (x0 - x))) / (Math.exp(k * (x0 - x)) + 1) ** 2
        ) * (output - expectedOutput));
        x0Nudges.push((
            (k * Math.exp(k * (x0 - x))) / (Math.exp(k * (x0 - x)) + 1) ** 2
        ) * (output - expectedOutput))
    })
    k += (kNudges.reduce((t, v) => t + v) / kNudges.length) * learningRate * -1;
    x0 += (x0Nudges.reduce((t, v) => t + v) / x0Nudges.length) * learningRate * -1;
    const cost = costs.reduce((t, v) => t + v) / costs.length;
    if (iteration % 10000 === 0) {
        console.log();
        console.log(`Iteration: ${iteration}, Cost: ${cost}`);
        console.log(`K: ${k}, X0: ${x0}`)
        console.log();
    }
    iteration += 1;
    if (iteration === 1000000) {
        break;
    }
}
