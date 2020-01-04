const plt = require("matplotnode");
let data = [];
for (let i = 0; i < 100; i++) {
    data.push([i, 2 * i - 2]);
}
data.sort(() => Math.random() - 0.5);
let m = 0;
let b = 0;
let learningRate = 0.0001 /* insert learning rate here */ ;
let batchSize = 100 /* You can use this for mini-batch training */ ;
let iteration = 0;

function limit(val, bound) {
    if (Math.abs(val) > bound) {
        return bound * Math.sign(val)
    }
    return val;
}
let idx = 0;
let points = [];
while (true) {
    const mNudges = [];
    const bNudges = [];
    const costs = [];
    data.slice(idx, idx + batchSize).forEach(([input, expectedOutput]) => {
        const output = m * input + b;
        const cost = ((output - expectedOutput) ** 2) / 2;
        costs.push(cost);
        mNudges.push(input * (output - expectedOutput));
        bNudges.push((output - expectedOutput));
    })
    idx += batchSize;
    if (idx >= data.length) {
        idx = 0;
    }
    m += (mNudges.reduce((t, v) => t + v) / mNudges.length) * learningRate * -1;
    b += (bNudges.reduce((t, v) => t + v) / bNudges.length) * learningRate * -1;
    const cost = costs.reduce((t, v) => t + v) / costs.length;
    points.push(cost);
    if (cost < 0.001 || cost === points[iteration - 1]) {
        break;
    }
    if (iteration % 10000 === 0) {
        console.log();
        console.log(`Iteration: ${iteration}, Cost: ${cost}`);
        console.log(`Slope: ${m}, Y-intercept: ${b}`)
        console.log();
    }
    if (!Number.isFinite(cost)) {
        break;
    }
    iteration++;
}
plt.plot(Object.keys(points).map(x => Number(x) + 1).filter((x, i) => i % 100 === 0 && i > 0), points.filter((x, i) => i % 100 === 0 && i > 0));
plt.xlabel("Iteration");
plt.ylabel("Cost")
plt.grid(true);
plt.save("graph.png");
console.log(`Slope: ${m.toFixed(3)}`);
console.log(`Y-intercept: ${b.toFixed(3)}`)