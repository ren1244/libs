//需要 utf8b64.js
function AES(key)
{
	this.keyInfo=this.getRoundKeys(key);
}
(function (){
	var sbox="Y3x3e/Jrb8UwAWcr/terdsqCyX36WUfwrdSir5ykcsC3/ZMmNj/3zDSl5fFx2DEVBMcjwxiWBZoHEoDi6yeydQmDLBobblqgUjvWsynjL4RT0QDtIPyxW2rLvjlKTFjP0O+q+0NNM4VF+QJ/UDyfqFGjQI+SnTj1vLbaIRD/89LNDBPsX5dEF8Snfj1kXRlzYIFP3CIqkIhG7rgU3l4L2+AyOgpJBiRcwtOsYpGV5HnnyDdtjdVOqWxW9Opleq4IunglLhymtMbo3XQfS72LinA+tWZIA/YOYTVXuYbBHZ7h+JgRadmOlJseh+nOVSjfjKGJDb/mQmhBmS0PsFS7Fg=="
	var sbox_r="Uglq1TA2pTi/QKOegfPX+3zjOYKbL/+HNI5DRMTe6ctUe5QypsIjPe5MlQtC+sNOCC6hZijZJLJ2W6JJbYvRJXL49mSGaJgW1KRczF1ltpJscEhQ/e252l4VRlenjZ2EkNirAIy80wr35FgFuLNFBtAsHo/KPw8Cwa+9AwETims6kRFBT2fc6pfyz87wtOZzlqx0IuetNYXi+TfoHHXfbkfxGnEdKcWJb7diDqoYvhv8Vj5LxtJ5IJrbwP54zVr0H92oM4gHxzGxEhBZJ4DsX2BRf6kZtUoNLeV6n5PJnO+g4DtNrir1sMjruzyDU5lhFysEfrp31ibhaRRjVSEMfQ==";
	var gf_mul=[];
	gf_mul[2]="AAIEBggKDA4QEhQWGBocHiAiJCYoKiwuMDI0Njg6PD5AQkRGSEpMTlBSVFZYWlxeYGJkZmhqbG5wcnR2eHp8foCChIaIioyOkJKUlpianJ6goqSmqKqsrrCytLa4ury+wMLExsjKzM7Q0tTW2Nrc3uDi5Obo6uzu8PL09vj6/P4bGR8dExEXFQsJDw0DAQcFOzk/PTMxNzUrKS8tIyEnJVtZX11TUVdVS0lPTUNBR0V7eX99c3F3dWtpb21jYWdlm5mfnZORl5WLiY+Ng4GHhbu5v72zsbe1q6mvraOhp6Xb2d/d09HX1cvJz83DwcfF+/n//fPx9/Xr6e/t4+Hn5Q==";
	gf_mul[3]="AAMGBQwPCgkYGx4dFBcSETAzNjU8Pzo5KCsuLSQnIiFgY2ZlbG9qaXh7fn10d3JxUFNWVVxfWllIS05NREdCQcDDxsXMz8rJ2Nve3dTX0tHw8/b1/P/6+ejr7u3k5+LhoKOmpayvqqm4u769tLeysZCTlpWcn5qZiIuOjYSHgoGbmJ2el5SRkoOAhYaPjImKq6itrqekoaKzsLW2v7y5uvv4/f739PHy4+Dl5u/s6erLyM3Ox8TBwtPQ1dbf3NnaW1hdXldUUVJDQEVGT0xJSmtobW5nZGFic3B1dn98eXo7OD0+NzQxMiMgJSYvLCkqCwgNDgcEAQITEBUWHxwZGg==";
	gf_mul[9]="AAkSGyQtNj9IQVpTbGV+d5CZgou0vaav2NHKw/z17uc7MikgHxYNBHN6YWhXXkVMq6K5sI+GnZTj6vH4x87V3HZ/ZG1SW0BJPjcsJRoTCAHm7/T9wsvQ2a6nvLWKg5iRTURfVmlge3IFDBceISgzOt3Uz8b58OvilZyHjrG4o6rs5f73yMHa06Sttr+AiZKbfHVuZ1hRSkM0PSYvEBkCC9fexczz+uHon5aNhLuyqaBHTlVcY2pxeA8GHRQrIjkwmpOIgb63rKXS28DJ9v/k7QoDGBEuJzw1QktQWWZvdH2hqLO6hYyXnung+/LNxN/WMTgjKhUcBw55cGtiXVRPRg==";
	gf_mul[11]="AAsWHSwnOjFYU05FdH9iabC7pq2cl4qB6OP+9cTP0tl7cG1mV1xBSiMoNT4PBBkSy8Dd1ufs8fqTmIWOv7Spovb94Ova0czHrqW4s4KJlJ9GTVBbamF8dx4VCAMyOSQvjYabkKGqt7zV3sPI+fLv5D02KyARGgcMZW5zeElCX1T3/OHq29DNxq+kubKDiJWeR0xRWmtgfXYfFAkCMzglLoyHmpGgq7a91N/Cyfjz7uU8NyohEBsGDWRvcnlIQ15VAQoXHC0mOzBZUk9EdX5jaLG6p6ydlouA6eL/9MXO09h6cWxnVl1ASyIpND8OBRgTysHc1+bt8PuSmYSPvrWoow==";
	gf_mul[13]="AA0aFzQ5LiNoZXJ/XFFGS9Ddysfk6f7zuLWir4yBlpu7tqGsj4KVmNPeycTn6v3wa2ZxfF9SRUgDDhkUNzotIG1gd3pZVENOBQgfEjE8Kya9sKeqiYSTntXYz8Lh7Pv21tvMweLv+PW+s6SpioeQnQYLHBEyPyglbmN0eVpXQE3a18DN7uP0+bK/qKWGi5yRCgcQHT4zJClib3h1VltMQWFse3ZVWE9CCQQTHj0wJyqxvKumhYifktnUw87t4Pf6t7qtoIOOmZTf0sXI6+bx/GdqfXBTXklEDwIVGDs2ISwMARYbODUiL2RpfnNQXUpH3NHGy+jl8v+0ua6jgI2alw==";
	gf_mul[14]="AA4cEjg2JCpwfmxiSEZUWuDu/PLY1sTKkJ6MgqimtLrb1cfJ4+3/8ault7mTnY+BOzUnKQMNHxFLRVdZc31vYa2jsb+Vm4mH3dPBz+Xr+fdNQ1FfdXtpZz0zIS8FCxkXdnhqZE5AUlwGCBoUPjAiLJaYioSuoLK85uj69N7QwsxBT11TeXdlazE/LSMJBxUboa+9s5mXhYvR383D6ef1+5qUhoiirL6w6uT2+NLczsB6dGZoQkxeUAoEFhgyPC4g7OLw/tTayMackoCOpKq4tgwCEB40OigmfHJgbkRKWFY3OSslDwETHUdJW1V/cWNt19nLxe/h8/2nqbu1n5GDjQ==";
	
	AES.prototype.sbox=sbox.decodeBase64();
	
	AES.prototype.sbox_r=sbox_r.decodeBase64();
	var idx;
	for(idx in gf_mul)
		gf_mul[idx]=gf_mul[idx].decodeBase64();
	AES.prototype.gf_mul=gf_mul;
})();
AES.prototype.getRoundKeys=function (key)
{
	var sbox=this.sbox;
	var nkList=[];nkList[16]=4;nkList[24]=6;nkList[32]=8;
	var nrList=[];nrList[16]=10;nrList[24]=12;nrList[32]=14;
	var nk=nkList[key.length];
	var nr=nrList[key.length];
	var w=new Uint8Array(16*(nr+1));
	var i,rcon=[0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1b,0x36],rcon_idx=0;
	for(i=0;i<nk*4;++i)
		w[i]=key[i];
	for(i=nk;i<4*(nr+1);++i)
	{
		if(i%nk==0)
		{
			w[i*4]=(w[(i-nk)*4]^(sbox[w[i*4-3]]^rcon[rcon_idx++]));
			w[i*4+1]=(w[(i-nk)*4+1]^sbox[w[i*4-2]]);
			w[i*4+2]=(w[(i-nk)*4+2]^sbox[w[i*4-1]]);
			w[i*4+3]=(w[(i-nk)*4+3]^sbox[w[i*4-4]]);
		}
		else if(nk>6 && i%nk==4)
		{
			w[i*4]=(w[(i-nk)*4]^sbox[w[i*4-4]]);
			w[i*4+1]=(w[(i-nk)*4+1]^sbox[w[i*4-3]]);
			w[i*4+2]=(w[(i-nk)*4+2]^sbox[w[i*4-2]]);
			w[i*4+3]=(w[(i-nk)*4+3]^sbox[w[i*4-1]]);
		}
		else
		{
			w[i*4]=(w[(i-nk)*4]^w[i*4-4]);
			w[i*4+1]=(w[(i-nk)*4+1]^w[i*4-3]);
			w[i*4+2]=(w[(i-nk)*4+2]^w[i*4-2]);
			w[i*4+3]=(w[(i-nk)*4+3]^w[i*4-1]);
		}
	}
	return {"nr":nr,"rk":w};
}

AES.prototype.subBytes=function (block,offset,sbox) //invSubByte use inverse sbox
{
	var i;
	for(i=0;i<16;++i)
		block[offset+i]=sbox[block[offset+i]];
}
AES.prototype.shiftRows=function (block,offset,shiftDirection) //shiftDirection=8 for enc 24 for dec
{
	var i,t,s;
	for(i=1;i<4;++i)
	{
		t=(block[offset+i]<<24|block[offset+i+4]<<16|block[offset+i+8]<<8|block[offset+i+12]);
		t=(t<<(shiftDirection*i)%32|t>>>(32-shiftDirection)*i%32);
		block[offset+i]=(t>>>24&0xFF);
		block[offset+i+4]=(t>>>16&0xFF);
		block[offset+i+8]=(t>>>8&0xFF);
		block[offset+i+12]=(t&0xFF);
	}
}
AES.prototype.mixColumns=function (block,offset,mode)
{
	var k,i,s=[];
	var gf_mul=this.gf_mul;
	if(mode==1)
	{
		for(k=0;k<16;k+=4)
		{
			for(i=0;i<4;++i)
				s[i]=block[offset+k+i];
			block[offset+k]=gf_mul[2][s[0]]^gf_mul[3][s[1]]^s[2]^s[3];
			block[offset+k+1]=s[0]^gf_mul[2][s[1]]^gf_mul[3][s[2]]^s[3];
			block[offset+k+2]=s[0]^s[1]^gf_mul[2][s[2]]^gf_mul[3][s[3]];
			block[offset+k+3]=gf_mul[3][s[0]]^s[1]^s[2]^gf_mul[2][s[3]];
		}
	}
	else
	{
		for(k=0;k<16;k+=4)
		{
			for(i=0;i<4;++i)
				s[i]=block[offset+k+i];
			block[offset+k]  =gf_mul[14][s[0]]^gf_mul[11][s[1]]^gf_mul[13][s[2]]^gf_mul[9][s[3]];
			block[offset+k+1]=gf_mul[9][s[0]]^gf_mul[14][s[1]]^gf_mul[11][s[2]]^gf_mul[13][s[3]];
			block[offset+k+2]=gf_mul[13][s[0]]^gf_mul[9][s[1]]^gf_mul[14][s[2]]^gf_mul[11][s[3]];
			block[offset+k+3]=gf_mul[11][s[0]]^gf_mul[13][s[1]]^gf_mul[9][s[2]]^gf_mul[14][s[3]];
		}
	}
}
AES.prototype.addRoundKey=function (block,bOffset,roundKeys,kOffset)
{
	for(i=0;i<16;++i)
		block[bOffset+i]^=roundKeys[kOffset+i]
}

AES.prototype.chiper=function (block,offset)
{
	var rks=this.keyInfo.rk;
	var nr=this.keyInfo.nr;
	this.addRoundKey(block,offset,rks,0);
	var i;
	for(i=1;i<nr;++i)
	{
		this.subBytes(block,offset,this.sbox);
		this.shiftRows(block,offset,8);
		this.mixColumns(block,offset,1);
		this.addRoundKey(block,offset,rks,16*i);
	}
	this.subBytes(block,offset,this.sbox);
	this.shiftRows(block,offset,8);
	this.addRoundKey(block,offset,rks,16*i);
}

AES.prototype.invChiper=function (block,offset)
{
	var rks=this.keyInfo.rk;
	var nr=this.keyInfo.nr;
	this.addRoundKey(block,offset,rks,nr*16);
	this.shiftRows(block,offset,24);
	this.subBytes(block,offset,this.sbox_r);
	var i;
	for(i=nr-1;i>0;--i)
	{
		this.addRoundKey(block,offset,rks,16*i);
		this.mixColumns(block,offset,-1);
		this.shiftRows(block,offset,24);
		this.subBytes(block,offset,this.sbox_r);
	}
	this.addRoundKey(block,offset,rks,0);
}

/*

function prt2(block,offset)
{
	return ("000"+(block[offset+0]<<8|block[offset+1]).toString(16)).substr(-4)
		+("000"+(block[offset+2]<<8|block[offset+3]).toString(16)).substr(-4)+"\n"
		+("000"+(block[offset+4]<<8|block[offset+5]).toString(16)).substr(-4)
		+("000"+(block[offset+6]<<8|block[offset+7]).toString(16)).substr(-4)+"\n"
		+("000"+(block[offset+8]<<8|block[offset+9]).toString(16)).substr(-4)
		+("000"+(block[offset+10]<<8|block[offset+11]).toString(16)).substr(-4)+"\n"
		+("000"+(block[offset+12]<<8|block[offset+13]).toString(16)).substr(-4)
		+("000"+(block[offset+14]<<8|block[offset+15]).toString(16)).substr(-4)+"\n";
}
function prt(block,offset)
{
	return ("000"+(block[offset+0]<<8|block[offset+4]).toString(16)).substr(-4)
		+("000"+(block[offset+8]<<8|block[offset+12]).toString(16)).substr(-4)+"\n"
		+("000"+(block[offset+1]<<8|block[offset+5]).toString(16)).substr(-4)
		+("000"+(block[offset+9]<<8|block[offset+13]).toString(16)).substr(-4)+"\n"
		+("000"+(block[offset+2]<<8|block[offset+6]).toString(16)).substr(-4)
		+("000"+(block[offset+10]<<8|block[offset+14]).toString(16)).substr(-4)+"\n"
		+("000"+(block[offset+3]<<8|block[offset+7]).toString(16)).substr(-4)
		+("000"+(block[offset+11]<<8|block[offset+15]).toString(16)).substr(-4)+"\n";
}

var inp=new Uint8Array([0x32,0x43,0xf6,0xa8,0x88,0x5a,0x30,0x8d,0x31,0x31,0x98,0xa2,0xe0,0x37,0x07,0x34]);
var k128=new Uint8Array([0x2b,0x7e,0x15,0x16,0x28,0xae,0xd2,0xa6,0xab,0xf7,0x15,0x88,0x09,0xcf,0x4f,0x3c]);
var str="";
var enc=new AES(k128);
str+=prt(inp,0)+"\n";


enc.chiper(inp,0);
str+=prt(inp,0)+"\n";
enc.invChiper(inp,0);
str+=prt(inp,0)+"\n";



document.getElementById("out").innerHTML=str;


*/


















