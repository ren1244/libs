import PdfDict from './pdf-core.js';
import { fmtstr } from './pdf-util.js';

function Pdf() {
    //Catalog
    this._catalog = new PdfDict({
        Type: '/Catalog',
        Pages: null,
    });

    //PageTree
    this._pageTree = new PdfDict({
        Type: '/Pages',
        Kids: [],
        Count: 0
    });
    this._catalog.entries.Pages = this._pageTree; //加到 catalog

    this._currentPage = null;
    this._resources = {};
}

/**
 * 增加一頁
 * @param {float} width 頁寬(mm)
 * @param {float} height 頁高(mm)
 */
Pdf.prototype.addPage = function (width, height) {
    this._currentPage = new PdfDict({
        Type: '/Page',
        Parent: this._pageTree,
        Resources: {},
        Contents: [],
        MediaBox: [0, 0, width * 72 / 25.4, height * 72 / 25.4]
    });
    this._pageTree.entries.Kids.push(this._currentPage); //加到 catalog
    ++this._pageTree.entries.Count;
}

/**
 * 取得頁面尺寸
 * @returns {array.<width,height>} [width(pt), height(pt)]
 */
Pdf.prototype.getPageSize = function () {
    if (this._currentPage === null) {
        return null;
    }
    return this._currentPage.entries.MediaBox.slice(2);
}

/**
 * 在目前的頁面寫入內容
 * @param {string|Uint8Array} stream 要寫入的內容
 */
Pdf.prototype.write = function (stream) {
    this._currentPage.entries.Contents.push(new PdfDict({}, stream));
}

/**
 * 取得目前頁面的 resourct 物件
 * @param {string} classname 類別名稱，例如：'font', 'XObject'
 * @param {string} objname 物件名稱
 * @returns {PdfDict|null}
 */
Pdf.prototype.getResource = function (classname, objname) {
    if (this._resources[classname] && this._resources[classname][objname]) {
        return this._resources[classname][objname];
    }
    return null;
}

/**
 * 把 PdfDict 作為 resource 加入目前的頁面
 * @param {string} classname 類別名稱，例如：'font', 'XObject'
 * @param {string} objname 物件名稱
 * @param {PdfDict} dict
 */
Pdf.prototype.addResource = function (classname, objname, dict) {
    const res = this._currentPage.entries.Resources;
    if (!res[classname]) {
        res[classname] = {};
    }
    res[classname][objname] = dict;
}

/**
 * 輸出
 * @param {?string} outputType 輸出的種類
 * @returns {Blob|string|Uint8Array|array}
 * |outputType|return                        |
 * |----------|------------------------------|
 * |blob      |Blob                          |
 * |url       |string of ObjectUrl           |
 * |array     |Uint8Array                    |
 * |undefined |array of string and Uint8Array|
 */
Pdf.prototype.output = function (outputType) {
    this._pageTree.entries.Kids.forEach(page => {
        page.entries.MediaBox = page.entries.MediaBox.map(x => fmtstr('{}', x));
    });
    let result = PdfDict.finalize(this._catalog);
    switch (outputType) {
        case 'blob':
            return new Blob(result, { type: 'application/pdf' });
        case 'url':
            return URL.createObjectURL(new Blob(result, { type: 'application/pdf' }));
        case 'array':
            let tmp = result.map(x => typeof x === 'string' ? new TextEncoder().encode(x) : x);
            let len = tmp.reduce((s, x) => s + x.byteLength, 0);
            let obj = tmp.reduce((o, x) => {
                o.arr.set(x, o.idx);
                o.idx += x.byteLength;
                return o;
            }, { idx: 0, arr: new Uint8Array(len) });
            return obj.arr;
        default:
            return result;
    }
}

export { Pdf, PdfDict, fmtstr };
