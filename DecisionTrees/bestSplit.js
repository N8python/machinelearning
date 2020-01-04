const R = require("ramda");

function getBestSplit({
    data,
    fields,
    toClassify
}) {
    const possibleSplits = R.fromPairs(R.zip(fields, Array(fields.length).fill(() => []).map(x => x())))
    fields.forEach(field => {
        possibleSplits[field] = R.pipe(
            R.map(R.prop(field)),
            R.sort((a, b) => a - b),
            R.aperture(2),
            R.map(R.mean)
        )(data);
    })
    const isYes = x => x[toClassify] === 1;
    const gini = (arr) => 1 - (R.filter(isYes, arr).length / arr.length) ** 2 - (R.reject(isYes, arr).length / arr.length) ** 2;
    const splitList = [];
    Object.entries(possibleSplits).forEach(([splitType, splits]) => {
        splits.forEach(split => {
            const qualifies = x => x[splitType] <= split;
            const yeses = R.filter(qualifies, data);
            const nos = R.reject(qualifies, data);
            const total = yeses.length + nos.length;
            const totalGini = gini(yeses) * yeses.length / total + gini(nos) * nos.length / total;
            splitList.push({
                field: splitType,
                value: split,
                gini: totalGini
            })
        })
    });
    const theBestSplit = R.sort((a, b) => a.gini - b.gini, splitList)[0];
    return theBestSplit;
}

module.exports = getBestSplit;