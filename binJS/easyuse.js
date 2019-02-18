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
		'utf8':binJS.s2a_utf8,
		'base64':binJS.s2a_base64,
		'hex':binJS.s2a_hex
	}[enc]).call(null,this);
}
Uint8Array.prototype.str=function(enc)
{
	if(!enc)
		enc='utf8';
	return ({
		'utf8':binJS.a2s_utf8,
		'base64':binJS.a2s_base64,
		'hex':binJS.a2s_hex
	}[enc]).call(null,this);
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

if(binJS.aes_cbc_enc && binJS.aes_cbc_dec){
	Uint8Array.prototype.cipher=function(method,key,iv)
	{
		
		return ({
			'aes_cbc_zero':binJS.aes_cbc_enc,
			'aes_cbc_pkcs7':binJS.aes_cbc_enc
		}[method]).apply(null,[this,key,iv,({
			'aes_cbc_zero':binJS.pad.zero,
			'aes_cbc_pkcs7':binJS.pad.pkcs7
		}[method])]);
	}
	Uint8Array.prototype.decipher=function(method,key,iv)
	{
		return ({
			'aes_cbc_zero':binJS.aes_cbc_dec,
			'aes_cbc_pkcs7':binJS.aes_cbc_dec,
		}[method]).apply(null,[this,key,iv,({
			'aes_cbc_zero':binJS.pad.zero,
			'aes_cbc_pkcs7':binJS.pad.pkcs7
		}[method])]);
	}
}