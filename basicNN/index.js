/* This neural net can exactly approximate xor (it needs more than 2 hidden neurons though, so improvements can be made)*/
const dotProduct = (t1, t2) => t1.map((x, i) => x * t2[i]).reduce((t, v) => t + v)
const sigmoid = x => 1 / (1 + Math.exp(-x))
const sigmoid_ = x => sigmoid(x) * (1 - sigmoid(x))
const unsigmoid = x => Math.log(1 / x - 1) / Math.log(Math.E) * -1
const xor = (x, y) => (x === y) ? 0 : 1;
const randWeight = () => Math.random() * 2 - 1
const math = require("mathjs");
const R = require("ramda");
const layers = [
    [
        [randWeight(), randWeight(), randWeight()],
        [randWeight(), randWeight(), randWeight()],
        [randWeight(), randWeight(), randWeight()],
        [randWeight(), randWeight(), randWeight()],
        [randWeight(), randWeight(), randWeight()],
        [randWeight(), randWeight(), randWeight()],
        [randWeight(), randWeight(), randWeight()],
        [randWeight(), randWeight(), randWeight()],
    ],
    [
        [randWeight(), randWeight(), randWeight(), randWeight(), randWeight(), randWeight(), randWeight(), randWeight(), randWeight()]
    ]
]

const feedForward = (inputs) => {
    layers.forEach(layer => {
        inputs = layer.map(row => sigmoid(dotProduct(inputs.concat(1), row)));
    })
    return inputs[0];
}

const hiddenNeurons = (inputs) => {
    return layers[0].map(row => sigmoid(dotProduct(inputs.concat(1), row))).concat(1);
}

const trainingData = R.repeat([
        [
            [0, 0], 0
        ],
        [
            [1, 0], 1
        ],
        [
            [0, 1], 1
        ],
        [
            [1, 1], 0
        ]
    ], 1).reduce((t, v) => t.concat(v)) //.sort(() => Math.random() - 0.5)
const learningRate = 0.3;
const computeCost = () => {
    const costs = trainingData.map(([input, desiredOutput]) => {
        const output = feedForward(input);
        return (output - desiredOutput) ** 2
    })
    return costs.reduce((t, v) => t + v) / costs.length;
}
const backProp = () => {
    const layer1NudgesList = [];
    const layer2NudgesList = [];
    trainingData.forEach(([sample, desiredOutput]) => {
        const output = feedForward(sample);
        const hns = hiddenNeurons(sample);
        let layer2Nudges = [];
        const hiddenLayerDesiredOutputs = [];
        const hiddenLayerGrad = [];
        layers[1][0].forEach((weight, idx) => {
            layer2Nudges[idx] = hns[idx] * sigmoid_(unsigmoid(output)) * 2 * (output - desiredOutput);
        })
        layer2Nudges = [layer2Nudges];
        const layer1Nudges = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];
        layers[0].forEach((row, i) => row.forEach((weight, j) => {
            const outputHnn = hns[i] || 1;
            //const desiredOutput = hiddenLayerDesiredOutputs[i] || 1;
            layer1Nudges[i].push((sample[j] || 1) * sigmoid_(unsigmoid(outputHnn)) * layers[1][0][i] * sigmoid_(unsigmoid(output)) * 2 * (output - desiredOutput));
        }))
        layer1NudgesList.push(layer1Nudges);
        layer2NudgesList.push(layer2Nudges);
    })
    const finalNudgesLayer1 = math.multiply(math.divide(layer1NudgesList.reduce((t, v) => math.add(t, v)), layer1NudgesList.length), -learningRate);
    const finalNudgesLayer2 = math.multiply(math.divide(layer2NudgesList.reduce((t, v) => math.add(t, v)), layer2NudgesList.length), -learningRate);
    layers[0] = math.add(finalNudgesLayer1, layers[0]);
    layers[1] = math.add(finalNudgesLayer2, layers[1]);
}
while (computeCost() > 0.1) {
    backProp()
    console.log()
    console.log(computeCost())
    console.log(feedForward([0, 0]))
    console.log(feedForward([1, 0]))
    console.log(feedForward([0, 1]))
    console.log(feedForward([1, 1]))
    console.log()
}
