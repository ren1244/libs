/**
 * 重複排列
 * 把 n 個相同的物品分成相異的 m 組
 * （a_0 + a_1 + ... + a_{m-1} = n）
 */
export default class RepeatCombination {

    /**
     * @param {int} n 要被分配的數量
     * @param {int} m 組數
     */
    constructor(n, m) {
        if (n < 0 || m < 2) {
            throw 'RepeatCombination constructor(n, m): n >= 0 and m >=2 required';
        }
        this.n = n;
        this.m = m;
        this.stack = [0];
        this.len = 1;
    }

    /**
     * 代表各組的個數的陣列
     * @returns {array|null}
     */
    next() {
        while (this.len > 0) {
            if (this.n < 0) {
                this.n += this.stack[--this.len];
                ++this.stack[this.len - 1];
                --this.n;
            } else if (this.len < this.m - 1) {
                this.stack[this.len++] = 0;
            } else {
                this.stack[this.m - 1] = this.n;
                let result = this.stack.slice(0, this.len + 1);
                ++this.stack[this.len - 1];
                --this.n;
                return result;
            }
        }
        return null;
    }
}
