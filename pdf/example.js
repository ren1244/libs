import { PdfDict, PdfDictRef } from './pdf-core.js';

//Catalog
let catalog = new PdfDict({
    Type: '/Catalog',
    Pages: null,
});

//PageTree
let pageTree = new PdfDict({
    Type: '/Pages',
    Kids: [],
    Count: 0
});
catalog.entries.Pages = pageTree; //加到 catalog

//第一頁
let page = new PdfDict({
    Type: '/Page',
    Parent: new PdfDictRef(pageTree),
    Resources: {},
    Contents: [],
    MediaBox: [0, 0, 210 * 72 / 25.4, 297 * 72 / 25.4] //A4 大小
});
pageTree.entries.Kids.push(page); //加到 catalog
++pageTree.entries.Count;

//內容(第一頁)
let ct1 = new PdfDict({}, `10 10 m 60 90 l 110 10 l s`, true); //在左下角畫一個三角形
page.entries.Contents.push(ct1);

//輸出結果
let result = PdfDict.finalize(catalog); //array of string and uint8Array
let url = URL.createObjectURL(new Blob(result, { type: 'application/pdf' }));
//設定到 iframe 可預覽 pdf
document.querySelector('.demo-iframe').src = url;
