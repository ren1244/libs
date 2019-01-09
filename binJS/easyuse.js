//require('../utf8b64.js');
//require('../sha2.js');
/*
化簡 utf8b64.js 與 sha2.js 的使用
*/
String.prototype.bin=function(enc)
{
	if(!enc)
		enc='utf8';
	return ({
		'utf8':String.prototype.toUTF8Array,
		'base64':String.prototype.decodeBase64,
		'hex':String.prototype.toHexArray
	}[enc]).apply(this);
}
Uint8Array.prototype.str=function(enc)
{
	if(!enc)
		enc='utf8';
	return ({
		'utf8':Uint8Array.prototype.toUTF8String,
		'base64':Uint8Array.prototype.encodeBase64,
		'hex':Uint8Array.prototype.toHexString
	}[enc]).apply(this);
}

if(window.sha2){
	Uint8Array.prototype.sha2=function(type)
	{
		return sha2(type,this);
	}
	Uint8Array.prototype.hmac_sha2=function(type,key)
	{
		if(typeof(key)==='string')
			key=key.bin('utf8');
		return hmac_sha2(type,this,key);
	}
	String.prototype.hmac_sha2=function(type,key)
	{
		if(typeof(key)==='string')
			key=key.bin('utf8');
		return hmac_sha2(type,this.bin('utf8'),key);
	}
}

if(Uint8Array.prototype.aes_cbc_zero_enc && Uint8Array.prototype.aes_cbc_zero_dec){
	Uint8Array.prototype.cipher=function(method,key)
	{
		return ({
			'aes_cbc_zero':Uint8Array.prototype.aes_cbc_zero_enc
		}[method]).apply(this,[key]);
	}
	Uint8Array.prototype.decipher=function(method,key)
	{
		return ({
			'aes_cbc_zero':Uint8Array.prototype.aes_cbc_zero_dec
		}[method]).apply(this,[key]);
	}
}