class DecisionTree {
    constructor({ left, right, thresh, leaf, field, verdict }) {
        this.left = left;
        this.right = right;
        this.thresh = thresh;
        this.leaf = leaf;
        this.verdict = verdict;
        this.field = field;
    }
    propagate(value) {
        if (this.leaf) {
            return this.verdict;
        }
        if (value[this.field] <= this.thresh) {
            return this.left.propagate(value);
        }
        return this.right.propagate(value);
    }
}

module.exports = (...args) => new DecisionTree(...args)