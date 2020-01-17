const BINJS_STATUS_STR=1;
const BINJS_STATUS_BIN=2;
const BINJS_STATUS_ERR=-1;

function BinJS(data) 
{
	return new BinJSBase(data);
}

function BinJSBase(data)
{
	this.status=typeof(data)==='string'?BINJS_STATUS_STR:BINJS_STATUS_BIN;
	this.data=data;
}

BinJSBase.prototype.str=function(type)
{
	if(this.status!==BINJS_STATUS_BIN) {
		throw 'BinJS: binary data required for BinJS.str method.';
	}
	if(!type) {
		type='utf8';
	}
	this.data=({
		'utf8':binJS.a2s_utf8,
		'base64':binJS.a2s_base64,
		'hex':binJS.a2s_hex
	}[type]).call(null, this.data);
	this.status=BINJS_STATUS_STR;
	return this;
}

BinJSBase.prototype.bin=function(type)
{
	if(this.status!==BINJS_STATUS_STR) {
		throw 'BinJS: string required for BinJS.bin method.';
	}
	if(!type) {
		type='utf8';
	}
	this.data=({
		'utf8':binJS.s2a_utf8,
		'base64':binJS.s2a_base64,
		'hex':binJS.s2a_hex
	}[type]).call(null, this.data);
	this.status=BINJS_STATUS_BIN;
	return this;
}

BinJSBase.prototype.val=function()
{
	return this.data;
}

BinJSBase.prototype._autoBin=function()
{
	if(this.status===BINJS_STATUS_STR) {
		this.bin();
	}
	if(this.status!==BINJS_STATUS_BIN) {
		throw 'BinJS: binary data required for BinJS.sha2 method.';
	}
}

if(window.sha2){
	BinJSBase.prototype.sha2=function(type)
	{
		this._autoBin();
		this.data=sha2(type, this.data);
		return this;
	}
	
	BinJSBase.prototype.hmac_sha2=function(type, key)
	{
		this._autoBin();
		if(typeof(key)==='string') {
			key=(new BinJSBase(key)).bin().val();
		}
		this.data=hmac_sha2(type, this.data, key);
		return this;
	}
}

if(binJS.aes_cbc_enc && binJS.aes_cbc_dec){
	
	BinJSBase.prototype.cipher=function(method,key,iv)
	{
		this._autoBin();
		this.data=({
			'aes_cbc_zero':binJS.aes_cbc_enc,
			'aes_cbc_pkcs7':binJS.aes_cbc_enc
		}[method]).apply(null,[this.data,key,iv,({
			'aes_cbc_zero':binJS.pad.zero,
			'aes_cbc_pkcs7':binJS.pad.pkcs7
		}[method])]);
		return this;
	}
	
	BinJSBase.prototype.decipher=function(method,key,iv)
	{
		this._autoBin();
		this.data=({
			'aes_cbc_zero':binJS.aes_cbc_dec,
			'aes_cbc_pkcs7':binJS.aes_cbc_dec,
		}[method]).apply(null,[this.data,key,iv,({
			'aes_cbc_zero':binJS.pad.zero,
			'aes_cbc_pkcs7':binJS.pad.pkcs7
		}[method])]);
		return this;
	}
}
