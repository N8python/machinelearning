const R = require("ramda");
const data = [
    [{
        IQ: 0.88,
        Income: 2.34
    }, 2.7],
    [{
        IQ: 0.92,
        Income: 0.8
    }, 3.2],
    [{
        IQ: 1.17,
        Income: 1.2,
    }, 3.5]
]

let learningRate = 0.001;
let medianAdjust = false;
let iteration = 0;

let weights = Array(Object.keys(data[0][0]).length).fill(0);
let bias = 0;

while (iteration < 1000) {
    const weightNudges = Array(weights.length).fill(() => []).map(x => x());
    const biasNudges = [];
    data.forEach(([inputs, expectedOutput]) => {
        const output = R.zipWith((x, y) => x * y, weights, Object.values(inputs)).reduce((t, v) => t + v) + bias;
        Object.values(inputs).forEach((input, idx) => {
            weightNudges[idx].push(input * (output - expectedOutput));
        })
        biasNudges.push((output - expectedOutput));
    })
    weights.forEach((_, idx) => {
        weights[idx] += -R.mean(weightNudges[idx]) * learningRate;
    })
    bias += -R.mean(biasNudges) * learningRate;
    console.log(weights, bias)
    iteration++;
}
// Let's normalize the data for comparison
let fields = {};
data.forEach(([inputs]) => {
    Object.entries(inputs).forEach(([key, val]) => {
        if (!fields[key]) {
            fields[key] = [];
        }
        fields[key].push(val);
    })
})

const meds = R.fromPairs(Object.entries(fields).map(([key, val]) => [key, R.median(val)]));
const adjustedWeights = weights.map((weight, idx) => {
    return weight * Object.values(meds)[idx];
}).concat(bias);
const sum = R.sum(adjustedWeights);
const proportions = adjustedWeights.map(x => x / sum);
const finalResult = R.fromPairs(R.zipWith((x, y) => [x, y], Object.keys(data[0][0]).concat("Other"), proportions));
console.log(`Component Analysis:`);
Object.entries(finalResult).sort(([_, p1], [__, p2]) => p2 - p1).forEach(([component, percent]) => {
    console.log(`${component}: ${(percent * 100).toFixed(3)}%`);
})