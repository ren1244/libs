var binJS={};
binJS.s2a_utf8=function(str)
{
	var i,N,k,k2,sz;
	//計算空間
	sz=0;
	for(i=sz=0,N=str.length;i<N;++i)
	{
		k=str.charCodeAt(i);
		if(k>=0xD800 && k<=0xDFFF){ //代理對
			k2=str.charCodeAt(++i);
			k=(k-0xD800<<10|k2-0xDC00)+0x10000;
		}
		sz+=k<0x800?(k<0x80?1:2):(k<0x10000?3:4);
	}
	//建立array
	var buf=new ArrayBuffer(sz);
	var arr=new Uint8Array(buf);
	//寫入資料
	for(i=sz=0,N=str.length;i<N;++i)
	{
		k=str.charCodeAt(i);
		if(k>=0xD800 && k<=0xDFFF){ //代理對
			k2=str.charCodeAt(++i);
			k=(k-0xD800<<10|k2-0xDC00)+0x10000;
		}
		if(k<0x800)
		{
			if(k<0x80)
			{
				arr[sz++]=k;
			}
			else
			{
				arr[sz++]=(0xC0|k>>>6&0x1F);
				arr[sz++]=(0x80|k&0x3F);
			}
		}
		else
		{
			if(k<0x10000)
			{
				arr[sz++]=(0xE0|k>>>12&0x0F);
				arr[sz++]=(0x80|k>>>6&0x3F);
				arr[sz++]=(0x80|k&0x3F);
			}
			else
			{
				arr[sz++]=(0xF0|k>>>18&0x07);
				arr[sz++]=(0x80|k>>>12&0x3F);
				arr[sz++]=(0x80|k>>>6&0x3F);
				arr[sz++]=(0x80|k&0x3F);
			}
		}
	}
	return arr;
}
binJS.s2a_base64=function(str)
{
	var i,N,k,c,sz;
	for(N=str.length;N>0 && str.charAt(N-1)=="=";--N);
	sz=N&3;
	if(sz==1)
	{
		console.log('sz_1');
		return false;
	}
	sz=(N>>>2)*3+(sz==0?0:(sz==2?1:2));
	var buf=new ArrayBuffer(sz);
	var arr=new Uint8Array(buf);
	sz=0;
	for(k=i=0;i<N;++i)
	{
		c=str.charCodeAt(i);
		if(48<=c && c<=57) //0-9
			c=c-48+52;
		else if(65<=c && c<=90) //A-Z
			c=c-65;
		else if(97<=c && c<=122) //a-z
			c=c-97+26;
		else if(c==43) //+
			c=62;
		else if(c==47) // /
			c=63;
		else
			return false;
		k=k<<6|c;
		if((i&3)==1)
		{
			arr[sz++]=k>>>4;
			k&=0x0F;
		}
		else if((i&3)==2)
		{
			arr[sz++]=k>>>2;
			k&=0x03;
		}
		else if((i&3)==3)
		{
			arr[sz++]=k;
			k=0;
		}
	}
	return arr;
}
binJS.a2s_utf8=function(u8arr)
{
	var mask=[0x7F,0x1F,0x0F,0x07];
	var msk2=[0x80,0xE0,0xF0,0xF8];
	var fit =[0x00,0xC0,0xE0,0xF0];
	var str="";
	var i,N,k,c,t;
	for(i=0,N=u8arr.length;i<N;i+=k+1)
	{
		c=u8arr[i];
		k=c<0xE0
		 ?(c<0xC0?0:1)
		 :(c<0xF0?2:3);
		if((c&msk2[k])!=fit[k])
			return false;
		c&=mask[k];
		for(j=0;j<k && i+j+1<N;++j)
		{
			t=u8arr[i+j+1];
			if((t&0xC0)!=0x80)
				return false;
			c=c<<6|t&0x3F;
		}
		if(c>=0x10000){
			c-=0x10000;
			str+=String.fromCharCode(0xD800+(c>>>10))
			    +String.fromCharCode(0xDC00+(c&0x3FF));
		} else {
			str+=String.fromCharCode(c);
		}
	}
	return str;
}
binJS.a2s_base64=function(u8arr)
{
	var tb="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var i,N,k,t;
	var b64str="";
	for(i=k=0,N=u8arr.length;i<N;++i)
	{
		k=k<<8|u8arr[i];
		if(i%3==0)
		{
			b64str+=tb[k>>>2];
			k&=0x03;
		}
		else if(i%3==1)
		{
			b64str+=tb[k>>>4];
			k&=0x0F;
		}
		else
		{
			b64str+=tb[k>>>6];
			b64str+=tb[k&0x3F];
			k=0;
		}
	}
	if(i%3==1)
		b64str+=tb[k<<4]+"==";
	else if(i%3==2)
		b64str+=tb[k<<2]+"=";
	return b64str;
}
binJS.a2s_hex=function(u8arr)
{
	var arr=[];
	for(let i=0;i<u8arr.length;++i)
		arr.push(("00"+u8arr[i].toString(16)).slice(-2));
	return arr.join('');
}
binJS.s2a_hex=function(str)
{
	var n=(str.length>>>1);
	var arr=new Uint8Array(n);
	for(let i=0;i<n;++i)
		arr[i]=parseInt(str.slice(i<<1,(i<<1)+2),16);
	return arr;
}
