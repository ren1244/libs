/**
 * 封裝瀏覽器原生的方法
 * 計算 hash 或 hash_hmac
 * 對應 utf-8的環境下的 php 中同樣名稱的函式
 */
const SAO={ //Signature Art Object
    _utf8Enc: new TextEncoder(),

    /**
     * 將 ArrayBuffer 的內容轉換為 base64 字串
     * 
     * @param {ArrayBuffer} buffer 
     * @returns {string} base64 字串
     */
    toBase64(buffer){
        let u8arr=new Uint8Array(buffer);
        let s=String.fromCharCode.apply(null, u8arr);
        return btoa(s);
    },

    /**
     * 將 ArrayBuffer 的內容轉換為 hex 字串
     * 
     * @param {ArrayBuffer} buffer 
     * @returns {string} hex 字串
     */
    toHex: (()=>{
        let hexArr=[];
        let tmp=Array.from('0123456789abcdef');
        for(let x=0;x<256;++x) {
            hexArr.push(tmp[x>>>4]+tmp[x&15]);
        }
        return (buffer)=>{
            let u8arr=new Uint8Array(buffer);
            let s='';
            for(let i=0,n=u8arr.length;i<n;++i) {
                s+=hexArr[u8arr[i]];
            }
            return s;
        }
    })(),

    /**
     * 計算雜湊
     * 
     * @param {string} alg 雜湊演算法，可為：SHA-1、SHA-256、SHA-384、SHA-512
     * @param {string} data 要被取雜湊的字串
     * @param {(function|null)} ouputFunc 輸出轉換函式
     * @returns {Promise} 用 ouputFunc 轉換後的結果，如果 ouputFunc 沒指定，則直接回傳 ArrayBuffer
     */
    hash: async function(alg, data, ouputFunc) {
        data=this._utf8Enc.encode(data);
        let buf=await crypto.subtle.digest(alg, data);
        return ouputFunc?ouputFunc(buf):buf;
    },

    /**
     * 計算 hmac
     * 
     * @param {string} alg 雜湊演算法，可為：SHA-1、SHA-256、SHA-384、SHA-512
     * @param {string} data 要被取雜湊的字串
     * @param {string} key 密鑰
     * @param {(function|null)} ouputFunc 輸出轉換函式
     * @returns {Promise} 用 ouputFunc 轉換後的結果，如果 ouputFunc 沒指定，則直接回傳 ArrayBuffer
     */
    hash_hmac: async function(alg, data, key, ouputFunc) {
        data=this._utf8Enc.encode(data);
        key=this._utf8Enc.encode(key);
        key=await crypto.subtle.importKey('raw', key, {
            name: 'HMAC',
            hash:{
                name: alg
            }
        }, false, ['sign', 'verify']);
        let buf=await crypto.subtle.sign('HMAC', key, data);
        return ouputFunc?ouputFunc(buf):buf;
    },
};
