/**
 * 封裝瀏覽器原生的方法
 * 計算 hash、hash_hmac、sign、verify
 * 對應 utf-8的環境下的 php 中同樣名稱的函式
 */
const SAO={ //Signature Art Object
    _utf8Enc: new TextEncoder(),

    /**
     * 將 base64 字串轉換為 ArrayBuffer
     * 
     * @param {string} b64 base64 字串
     * @returns {ArrayBuffer} 
     */
    fromBase64(b64){
        return (Uint8Array.from(atob(b64), x=>x.charCodeAt())).buffer;
    },

    /**
     * 將 16進位字串轉換為 ArrayBuffer
     * @param {string} hex 16進位字串
     * @returns {ArrayBuffer} 
     */
    fromHex:(()=>{
        let vMap={};
        let tmp=Array.from('0123456789abcdef');
        for(let x=0;x<256;++x) {
            vMap[tmp[x>>>4]+tmp[x&15]]=x;
        }
        return (hex)=>{
            let n=hex.length;
            if(n&1) {
                throw '16進位字串必須有偶數個字元';
            }
            let arr=new Uint8Array(n>>>1);
            for(let i=1;i<n;i+=2) {
                arr[i>>>1]=vMap[hex.slice(i-1, i+1)];
            }
            return arr.buffer;
        }
    })(),

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

    /**
     * 產生一對 publicKey 跟 privateKey 給 sign 或 verify 使用
     * (使用 RSA 2048 bit, RSASSA-PKCS1-v1_5)
     * 
     * @param {string} alg 雜湊演算法，可為：SHA-1、SHA-256、SHA-384、SHA-512
     * @returns {object} object with publicKey and privateKey
     */
    genKey: async function(alg) {
        let key=await crypto.subtle.generateKey({
            name: 'RSASSA-PKCS1-v1_5',
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: alg
        }, true, ["sign", "verify"]);
        let arr=await Promise.all([
            crypto.subtle.exportKey('pkcs8', key.privateKey),
            crypto.subtle.exportKey('spki', key.publicKey),
        ]);
        let pemArr=arr.map((buf,idx)=>{
            let b64=btoa(String.fromCharCode.apply(null, new Uint8Array(buf)));
            let name=idx===0?'PRIVATE':'PUBLIC';
            let pem=[`-----BEGIN ${name} KEY-----`];
            for(let i=0, n=b64.length; i<n; i+=64) {
                pem.push(b64.slice(i, i+64<n?i+64:n));
            }
            pem.push(`-----END ${name} KEY-----\n`);
            return pem.join('\n');
        });
        return {
            privateKey: pemArr[0],
            publicKey: pemArr[1],
        };
    },

    /**
     * 讀取 pem 格式的 key
     * 轉換為瀏覽器使用的 CryptoKey object
     * 
     * @param {string} key 公鑰或私鑰(pem格式)
     * @param {string} alg 雜湊演算法，可為：SHA-1、SHA-256、SHA-384、SHA-512
     * @returns {CryptoKey Object}
     */
    _importKey: async function (key, alg) {
        alg={
            name: 'RSASSA-PKCS1-v1_5',
            hash: alg
        };
        let arr=key.split('\n');
        let type=arr[0].match(/-----BEGIN ([A-Z]+) KEY-----/)[1];
        let b64=arr.reduce((b64,x)=>{
            if(x.length>0 && x[0]!=='-') {
                b64+=x;
            }
            return b64;
        }, '');
        let buf=this.fromBase64(b64);
        if(type=='PRIVATE') {
            return crypto.subtle.importKey("pkcs8", buf, alg, true, ["sign"]);
        } else if(type==='PUBLIC') {
            return crypto.subtle.importKey("spki", buf, alg, true, ["verify"]);
        } else {
            return Promise.reject('不支援的 key');
        }
    },

    /**
     * 計算數位簽章雜湊
     * 
     * @param {string} data 要被簽章的字串
     * @param {string} key 私鑰(pem格式)
     * @param {string} alg 雜湊演算法，可為：SHA-1、SHA-256、SHA-384、SHA-512
     * @param {(function|null)} ouputFunc 輸出轉換函式
     * @returns {Promise} 用 ouputFunc 轉換後的結果，如果 ouputFunc 沒指定，則直接回傳 ArrayBuffer
     */
    sign: async function(data, key, alg, ouputFunc) {
        key=await this._importKey(key, alg);
        let buf=await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, this._utf8Enc.encode(data));
        return ouputFunc?ouputFunc(buf):buf;
    },

    /**
     * 驗證數位簽章
     * 
     * @param {string} data 要確認的字串
     * @param {ArrayBuffer|string} sign 數位簽章，應為 ArrayBuffer，若為字串，需要設定 signConv
     * @param {string} key 公鑰(pem格式)
     * @param {string} alg 雜湊演算法，可為：SHA-1、SHA-256、SHA-384、SHA-512
     * @param {function} signConv 將 sign 轉換為 buffer 的函式
     * @returns {Promise} bool代表驗證成功或失敗
     */
    verify: async function(data, sign, key, alg, signConv) {
        key=await this._importKey(key, alg);
        if(signConv) {
            sign=signConv(sign);
        }
        let verified=await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, sign, this._utf8Enc.encode(data));
        return verified;
    },
};
