//require('./aes.js')
/*
加密：
	chiper=plain.aes_cbc_zero_enc(key);
	plain=chiper.aes_cbc_zero_dec(key);
	
	其中 plain 跟 chiper 作為輸入時，可以為任意長度的 Uint8Array
	key 為 特定長度的 Uint8Array，長度決定 AES 模式
	(key length=32、48、64 分別是 AES 128、192、256)
*/


binJS.random_iv=function(){
	var i,arr=new Uint8Array(16);
	for(i=0;i<16;++i)
		arr[i]=(Math.random()*256|0);
	return arr;
}

binJS.pad={};

binJS.pad.zero={}

binJS.pad.zero.enc=function(u8arr){
	var newArr=new Uint8Array(((u8arr.length+15)/16|0)*16);
	newArr.set(u8arr);
	return newArr;
}

binJS.pad.zero.dec=function(u8arr){
	return u8arr; //zero padding 無法判斷檔案長度
}

binJS.pad.pkcs7={}

binJS.pad.pkcs7.enc=function(u8arr){
	var newArr=new Uint8Array(((u8arr.length+16)/16|0)*16);
	newArr.set(u8arr);
	newArr.fill(newArr.length-u8arr.length,u8arr.length);
	return newArr;
}
binJS.pad.pkcs7.dec=function(u8arr){
	var x=u8arr[u8arr.length-1];
	return u8arr.slice(0,u8arr.length-x);
}

binJS.aes_cbc_enc=function(u8arr,key,iv,padFunc)
{
	if(!padFunc){
		padFunc=binJS.pad.pkcs7;
	}
	var aes=new AES(key);
	var arr=padFunc.enc(u8arr);
	var i,j,sz=arr.length/16;
	for(j=0;j<16;++j)
		arr[j]^=iv[j];
	aes.chiper(arr,0);
	for(i=1;i<sz;++i){
		for(j=0;j<16;++j)
			arr[i*16+j]^=arr[(i-1)*16+j];
		aes.chiper(arr,i*16);
	}
	return arr;
}

binJS.aes_cbc_dec=function(u8arr,key,iv,padFunc)
{
	if(!padFunc){
		padFunc=binJS.pad.pkcs7;
	}
	var aes=new AES(key);
	var arr=u8arr.slice();
	var i,j;
	for(i=arr.length-16;i>0;i-=16)
	{
		aes.invChiper(arr,i);
		for(j=0;j<16;++j)
			arr[i+j]^=arr[i-16+j];
	}
	aes.invChiper(arr,0);
	for(j=0;j<16;++j)
		arr[j]^=iv[j];
	return padFunc.dec(arr);
}
