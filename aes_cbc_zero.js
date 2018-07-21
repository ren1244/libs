//需要 aes.js
Uint8Array.prototype.aes_cbc_zero_enc=function(key)
{
	var aes=new AES(key);
	var sz=((this.length+15+16)/16|0);
	var arr=new Uint8Array(sz*16);
	var i,j,t;
	for(i=0;i<16;++i)
		arr[i]=(Math.random()*256|0);
	arr.set(this,16);
	for(i=1;i<sz;++i)
	{
		for(j=0;j<16;++j)
			arr[i*16+j]^=arr[(i-1)*16+j];
		aes.chiper(arr,i*16);
	}
	return arr;
}
Uint8Array.prototype.aes_cbc_zero_dec=function(key)
{
	var aes=new AES(key);
	var arr=this.subarray(16);
	var sz=(arr.length/16|0);
	var i,j;
	for(i=sz-1;i>0;--i)
	{
		console.log('decode block:'+i);
		aes.invChiper(arr,i*16);
		for(j=0;j<16;++j)
			arr[i*16+j]^=arr[(i-1)*16+j];
	}
	aes.invChiper(arr,0);
	for(j=0;j<16;++j)
		arr[j]^=this[j];
	return arr;
}
