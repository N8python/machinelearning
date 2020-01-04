const dt = require("./decisionTree");
const bestSplit = require("./bestSplit");
const fs = require("fs");
const R = require("ramda");
const data = [{
    age: 7,
    income: 10,
    likesPokemon: 1
}, {
    age: 12,
    income: 30,
    likesPokemon: 1
}, {
    age: 14,
    income: 11,
    likesPokemon: 0
}, {
    age: 5,
    income: 0,
    likesPokemon: 0
}, {
    age: 10,
    income: 15,
    likesPokemon: 1
}];
const fields = ["age", "income"];
const toClassify = "likesPokemon";
const myDt = constructDt({
    data,
    fields: ["age", "income"],
    toClassify: "likesPokemon"
});

function constructDt({
    data,
    fields,
    toClassify
}) {
    const split = bestSplit({
        data,
        fields,
        toClassify
    });
    const isTrue = x => x[toClassify] === 1;
    const trues = R.filter(isTrue, data);
    const falses = R.reject(isTrue, data);
    const gini = 1 - (trues.length / data.length) ** 2 - (falses.length / data.length) ** 2;
    const type = trues.length > falses.length ? 1 : 0;
    let d;
    if (split === undefined || split.gini > gini) {
        return dt({
            leaf: true,
            verdict: type
        });
    }
    const qualifies = x => x[split.field] < split.value;
    const yeses = R.filter(qualifies, data);
    const nos = R.reject(qualifies, data);
    return dt({
        left: constructDt({ data: yeses, fields, toClassify }),
        right: constructDt({ data: nos, fields, toClassify }),
        thresh: split.value,
        field: split.field
    });
}
let doneCorrectly = 0;
data.forEach(piece => {
    if (piece[toClassify] === myDt.propagate(piece)) {
        doneCorrectly += 1;
    }
})
fs.writeFileSync("dtTree.json", JSON.stringify(myDt, undefined, 4))
const percent = doneCorrectly / data.length * 100;
console.log(`Percent Correctly: ${percent}%`);