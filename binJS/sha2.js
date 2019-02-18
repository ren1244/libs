/*實作 sha2 family

使用方式：
-----------------------------------
sha2(type,data)
參數：
	type:字串，'224', '256', '384', '512', '512/225', '512/256'
	data:Uint8Array，要被做雜湊的資料
回傳：
	Uint8Array，雜湊的結果
	或是 flase ... 當 type 參數錯誤時
-----------------------------------	
hmac_sha2(type,data,key)
參數：
	type:字串，'224', '256', '384', '512', '512/225', '512/256'
	data:Uint8Array，要被做雜湊的資料
	key:Uint8Array，Key
回傳：
	Uint8Array，雜湊的結果
	或是 flase ... 當 type 參數錯誤時
*/
var sha2=(function(){
	//const initial
	var h_512='agnmZ/O8yQi7Z66FhMqnOzxu83L+lPgrpU/1Ol8dNvFRDlJ/reaC0ZsFaIwrPmwfH4PZq/tBvWtb4M0ZE34heQ==';
	var k_512='QoovmNcoriJxN0SRI+9lzbXA+8/sTTsv6bXbpYGJ27w5VsJb80i1OFnxEfG2BdAZkj+CpK8ZT5urHF7V2m2BGNgHqpijAwJCEoNbAUVwb74kMYW+TuSyjFUMfcPV/7Ticr5ddPJ7iW+A3rH+OxaWsZvcBqclxxI1wZvxdM9pJpTkm2nBnvFK0u++R4Y4TyXjD8GdxouM1bUkDKHMd6ycZS3pLG9ZKwJ1SnSEqm6m5INcsKncvUH71Hb5iNqDEVO1mD5RUu5m36uoMcZtLbQyELADJ8iY+yE/v1l/x77vDuTG4AvzPaiPwtWnkUeTCqclBspjUeADgm8UKSlnCg5ucCe3CoVG0i/8LhshOFwmySZNLG38WsQq7VM4DROdlbPfZQpzVIuvY952agq7PHeyqIHCyS5H7a7mknIshRSCNTuiv+ihTPEDZKgaZku8QjABwkuLcND4l5HHbFGjBlS+MNGS6BnW71IY1pkGJFVlqRD0DjWFV3EgKhBqoHAyu9G4GaTBFrjS0MgeN2wIUUGrUydId0zfjuuZNLC8teGbSKg5HAyzxclaY07YqkrjQYrLW5zKT3dj43NoLm/z1rK4o3SPgu5d77L8eKVjb0MXL2CEyHgUofCrcozHAggaZDnskL7/+iNjHiikUGzr3oK96b75o/eyxnkVxnF48uNyUyvKJz7O6iZhnNGGuMchwMIH6tp91s3g6x71fU9/7m7ReAbwZ6pyF2+6CmN9xaLImKYRP5gEvvkNrhtxCzUTHEcbKNt39SMEfYQyyqt7QMckkzyevgoVyb68Qx1nxJwQDUxMxdS+yz5Ctll/KZz8ZX4qX8tvqzrW+uxsRBmMSkdYFw==';
	var h_256='agnmZ7tnroU8bvNypU/1OlEOUn+bBWiMH4PZq1vgzRk=';
	var k_256='QoovmHE3RJG1wPvP6bXbpTlWwltZ8RHxkj+CpKscXtXYB6qYEoNbASQxhb5VDH3Dcr5ddIDesf6b3AanwZvxdOSbacHvvkeGD8GdxiQMocwt6SxvSnSEqlywqdx2+YjamD5RUqgxxm2wAyfIv1l/x8bgC/PVp5FHBspjURQpKWcntwqFLhshOE0sbfxTOA0TZQpzVHZqCruBwskuknIshaK/6KGoGmZLwkuLcMdsUaPRkugZ1pkGJPQONYUQaqBwGaTBFh43bAgnSHdMNLC8tTkcDLNO2KpKW5zKT2gub/N0j4LueKVjb4TIeBSMxwIIkL7/+qRQbOu++aP3xnF48g==';
	var h_384='y7udXcEFnthimikqNnzVB5FZAVowcN0XFS/s2PcOWTlnMyZn/8ALMY60SodoWBUR2wwuDWT5j6dHtUgdvvpPpA==';
	var h_512_224='jD03yBlUTaJz4ZlmidzU1h36t64y/5yCZ53VFFgvn88PbStpe9RNqHfjb3MExIlCP52FqGodNsgREuatkdaSoQ==';
	var h_512_256='IjEhlPwr9yyfVV+jyExkwiOTuGtvU7FRljh3GVlA6r2WKD7iqI7/475eHiVThjmSKwGZ/CyFuKoOty3cgcUsog==';
	var h_224='wQWe2DZ81QcwcN0X9w5ZOf/ACzFoWBURZPmPp776T6Q=';
	
	h_512=binJS.s2a_base64(h_512);
	k_512=binJS.s2a_base64(k_512);
	h_256=binJS.s2a_base64(h_256);
	k_256=binJS.s2a_base64(k_256);
	h_384=binJS.s2a_base64(h_384);
	h_224=binJS.s2a_base64(h_224);
	h_512_224=binJS.s2a_base64(h_512_224);
	h_512_256=binJS.s2a_base64(h_512_256);
	
	//定義 word 的運算
	//R,A,B 都是 DataView物件 ,分別以 z,x,y為offest
	//以下函式要能允許 A=A op B 
	var word32OP={ //定義 32 位元運算
		'w_and':function(R,z,A,x,B,y){ //R(z)=A(x)&A(y)
			var t=A.getUint32(x<<2)&B.getUint32(y<<2);
			R.setUint32(z<<2, t);
		},
		'w_or':function(R,z,A,x,B,y){ //R(z)=A(x)|A(y)
			var t=A.getUint32(x<<2)|B.getUint32(y<<2);
			R.setUint32(z<<2, t);
		},
		'w_xor':function(R,z,A,x,B,y){ //R(z)=A(x)^A(y)
			var t=A.getUint32(x<<2)^B.getUint32(y<<2);
			R.setUint32(z<<2, t);
		},
		'w_not':function(R,z,A,x){ //R(z)=~A(x)
			var t=~A.getUint32(x<<2);
			R.setUint32(z<<2, t);
		},
		'w_add':function(R,z,A,x,B,y){ //R(z)=(A(x)+B(y))%2^32
			var a=A.getUint32(x<<2),
			    b=B.getUint32(y<<2);
			var L=(a&0xFFFF)+(b&0xFFFF);
			var H=(a>>>16)+(b>>>16)+(L>>>16);
			R.setUint32(z<<2, (H&0xFFFF)<<16|(L&0xFFFF));
		},
		//[注意!!] 因為 sha shift 或 rotate 的位元數不會是64或32的整數倍，所以這邊 w_rotate 跟 w_shift 沒做這邊界的檢查
		'w_shift':function(R,z,A,x,n){ //R(z)=A(x)>>>n
			var t=A.getUint32(x<<2)>>>n;
			R.setUint32(z<<2, t);
		},
		'w_rotate':function(R,z,A,x,n){ //R(z)=A(x) rot n
			var t=A.getUint32(x<<2);
			R.setUint32(z<<2, (t>>>n|t<<32-n));
		},
		'w_set':function(R,z,A,x){ //R(z)=A(x)
			var t=A.getUint32(x<<2);
			R.setUint32(z<<2, t);
		},
		'c_sum0':[2,13,22],
		'c_sum1':[6,11,25],
		'c_sig0':[7,18,3],
		'c_sig1':[17,19,10]
	}
	
	var word64OP={ //定義 64 位元運算
		'w_and':function(R,z,A,x,B,y){ //R(z)=A(x)&A(y)
			var L=A.getUint32(x<<3)&B.getUint32(y<<3),
			    H=A.getUint32((x<<3)+4)&B.getUint32((y<<3)+4);
			R.setUint32(z<<3,L);
			R.setUint32((z<<3)+4,H);
		},
		'w_or':function(R,z,A,x,B,y){ //R(z)=A(x)|A(y)
			var L=A.getUint32(x<<3)|B.getUint32(y<<3),
			    H=A.getUint32((x<<3)+4)|B.getUint32((y<<3)+4);
			R.setUint32(z<<3,L);
			R.setUint32((z<<3)+4,H);
		},
		'w_xor':function(R,z,A,x,B,y){ //R(z)=A(x)^A(y)
			var L=A.getUint32(x<<3)^B.getUint32(y<<3),
			    H=A.getUint32((x<<3)+4)^B.getUint32((y<<3)+4);
			R.setUint32(z<<3,L);
			R.setUint32((z<<3)+4,H);
		},
		'w_not':function(R,z,A,x){ //R(z)=~A(x)
			var L=~A.getUint32(x<<3),
			    H=~A.getUint32((x<<3)+4);
			R.setUint32(z<<3,L);
			R.setUint32((z<<3)+4,H);
		},
		'w_add':function(R,z,A,x,B,y){ //R(z)=(A(x)+B(y))%2^32
			var AH=A.getUint32(x<<3),
				AL=A.getUint32((x<<3)+4);
			var BH=B.getUint32(y<<3),
				BL=B.getUint32((y<<3)+4);
			
			var L=(AL&0xFFFF)+(BL&0xFFFF);
			var H=(AL>>>16)+(BL>>>16)+(L>>>16);
			R.setUint32((z<<3)+4, (H&0xFFFF)<<16|(L&0xFFFF));
			
			L=(AH&0xFFFF)+(BH&0xFFFF)+(H>>>16);
			H=(AH>>>16)+(BH>>>16)+(L>>>16);
			R.setUint32(z<<3,(H&0xFFFF)<<16|(L&0xFFFF));
		},
		//[注意!!] 因為 sha shift 或 rotate 的位元數不會是64或32的整數倍，所以這邊 w_rotate 跟 w_shift 沒做這邊界的檢查
		'w_shift':function(R,z,A,x,n){ //R(z)=A(x)>>>n
			var H=A.getUint32(x<<3),
			    L=A.getUint32((x<<3)+4);
			if(n<32){
				R.setUint32(z<<3,H>>>n);
				R.setUint32((z<<3)+4,H<<32-n|L>>>n);
			}else{
				R.setUint32(z<<3,0);
				R.setUint32((z<<3)+4,H>>>n-32);
			}
		},
		'w_rotate':function(R,z,A,x,n){ //R(z)=A(x) rot n
			var H=A.getUint32(x<<3),
			    L=A.getUint32((x<<3)+4);
			if(n<32){
				R.setUint32(z<<3,L<<32-n|H>>>n);
				R.setUint32((z<<3)+4,H<<32-n|L>>>n);
			}else{
				n-=32;
				R.setUint32((z<<3)+4,L<<32-n|H>>>n);
				R.setUint32((z<<3),H<<32-n|L>>>n);
			}
		},
		'w_set':function(R,z,A,x){ //R(z)=A(x)
			var L=A.getUint32(x<<3),
			    H=A.getUint32((x<<3)+4);
			R.setUint32(z<<3,L);
			R.setUint32((z<<3)+4,H);
		},
		'c_sum0':[28,34,39],
		'c_sum1':[14,18,41],
		'c_sig0':[1,8,7],
		'c_sig1':[19,61,6]
	}
	
	var config={
		'224':{
			'wordSize':4,
			'wordSizePow':2,
			'H0':h_224,
			'K':k_256,
			'op':word32OP,
			'outputLen':28
		},
		'256':{
			'wordSize':4,
			'wordSizePow':2,
			'H0':h_256,
			'K':k_256,
			'op':word32OP
		},
		'512':{
			'wordSize':8,
			'wordSizePow':3,
			'H0':h_512,
			'K':k_512,
			'op':word64OP
		},
		'384':{
			'wordSize':8,
			'wordSizePow':3,
			'H0':h_384,
			'K':k_512,
			'op':word64OP,
			'outputLen':48
		},
		'512/224':{
			'wordSize':8,
			'wordSizePow':3,
			'H0':h_512_224,
			'K':k_512,
			'op':word64OP,
			'outputLen':28
		},
		'512/256':{
			'wordSize':8,
			'wordSizePow':3,
			'H0':h_512_256,
			'K':k_512,
			'op':word64OP,
			'outputLen':32
		}
	};
	
	return function(type,u8arr){
		//prepare
		if(!config[type])
			return false;
		var wordSize=config[type].wordSize,
		    wordSizePow=config[type].wordSizePow,
		    H0=config[type].H0,
			K=config[type].K,
			op=config[type].op;
		
		var MLen=u8arr.length;
		var nByte=((MLen+wordSize*20)>>>wordSizePow+4<<wordSizePow+4); //padding 後的位元組數
		
		//padding
		var M=new ArrayBuffer(nByte);
		var u8M=new Uint8Array(M),
		    dvM=new DataView(M);
		
		u8M.set(u8arr); //填上資料
		u8M[MLen]=128; //填充bin(10000000)
		u8M[nByte-1]=((MLen&0x1F)<<3);
		for(let i=1;i<4;++i)
			u8M[nByte-1-i]=(MLen>>>8*i-3&0xFF); //[*]這邊會造成32bit限制，沒有實際到64bit，因此乾脆迴圈只到4
		
		//MainLoop
		var H=H0.buffer.slice(), //8個 word,複製 H0 到 H
		    T=new ArrayBuffer(wordSize*8), //8個 word,作為 a,b,c,d,e,f,g,h
			B=new ArrayBuffer(wordSize*16), //作為計算的buffer
			W=new ArrayBuffer(K.length); //Wj使用
		var dvH=new DataView(H),
			u8H=new Uint8Array(H),
		    dvT=new DataView(T),
			u8T=new Uint8Array(T),
			dvB=new DataView(B),
			u8B=new Uint8Array(B),
			dvK=new DataView(K.buffer)
		    dvW=new DataView(W),
			u8W=new Uint8Array(W);
		var iN=(nByte>>>wordSizePow+4),
		    jN=(K.length>>>wordSizePow);
		
		for(let i=0;i<iN;++i)
		{
			u8T.set(u8H);
			for(j=0;j<jN;++j)
			{
				//計算T1=h+sum1(e)+ch(e,f,g)+kj+wj
				op.w_set(dvB,0,dvT,7);
				//計算T1::add sum1(e)
				op.w_rotate(dvB,1,dvT,4,op.c_sum1[0]);
				op.w_rotate(dvB,2,dvT,4,op.c_sum1[1]);op.w_xor(dvB,1,dvB,1,dvB,2);
				op.w_rotate(dvB,2,dvT,4,op.c_sum1[2]);op.w_xor(dvB,1,dvB,1,dvB,2);
				op.w_add(dvB,0,dvB,0,dvB,1);
				//計算T1::add ch(e,f,g)
				op.w_and(dvB,1,dvT,4,dvT,5);
				op.w_not(dvB,2,dvT,4);op.w_and(dvB,2,dvB,2,dvT,6);
				op.w_xor(dvB,1,dvB,1,dvB,2);
				op.w_add(dvB,0,dvB,0,dvB,1);
				//計算T1::add kj
				op.w_add(dvB,0,dvB,0,dvK,j);
				//計算T1::add wj
				if(j<16){
					op.w_set(dvW,j,dvM,16*i+j);
				}else{
					op.w_rotate(dvB,1,dvW,j-2,op.c_sig1[0]);
					op.w_rotate(dvB,2,dvW,j-2,op.c_sig1[1]);op.w_xor(dvB,1,dvB,1,dvB,2);
					op.w_shift(dvB,2,dvW,j-2,op.c_sig1[2]);
					op.w_xor(dvW,j,dvB,1,dvB,2);
					op.w_add(dvW,j,dvW,j,dvW,j-7);
					
					op.w_rotate(dvB,1,dvW,j-15,op.c_sig0[0]);
					op.w_rotate(dvB,2,dvW,j-15,op.c_sig0[1]);op.w_xor(dvB,1,dvB,1,dvB,2);
					op.w_shift(dvB,2,dvW,j-15,op.c_sig0[2]);op.w_xor(dvB,1,dvB,1,dvB,2);
					op.w_add(dvW,j,dvW,j,dvB,1);
					op.w_add(dvW,j,dvW,j,dvW,j-16);
				}
				op.w_add(dvB,0,dvB,0,dvW,j); //T1儲存於 dvB[0]
				
				//計算T2=sum0(a)+maj(a,b,c)
				op.w_rotate(dvB,1,dvT,0,op.c_sum0[0]);
				op.w_rotate(dvB,2,dvT,0,op.c_sum0[1]);op.w_xor(dvB,1,dvB,1,dvB,2);
				op.w_rotate(dvB,2,dvT,0,op.c_sum0[2]);op.w_xor(dvB,1,dvB,1,dvB,2);
				op.w_and(dvB,2,dvT,0,dvT,1);
				op.w_and(dvB,3,dvT,0,dvT,2);op.w_xor(dvB,2,dvB,2,dvB,3);
				op.w_and(dvB,3,dvT,1,dvT,2);op.w_xor(dvB,2,dvB,2,dvB,3);
				op.w_add(dvB,1,dvB,1,dvB,2); //T2儲存於 dvB[1]
				
				//更新a,b,c,d,e,f,g,h
				op.w_set(dvT,7,dvT,6);
				op.w_set(dvT,6,dvT,5);
				op.w_set(dvT,5,dvT,4);
				op.w_add(dvT,4,dvT,3,dvB,0);
				op.w_set(dvT,3,dvT,2);
				op.w_set(dvT,2,dvT,1);
				op.w_set(dvT,1,dvT,0);
				op.w_add(dvT,0,dvB,0,dvB,1);
			}
			for(let j=0;j<8;++j)
				op.w_add(dvH,j,dvH,j,dvT,j)
		}
		if(config[type].outputLen)
			return u8H.slice(0,config[type].outputLen);
		return u8H;
		
		function sum1(R,A){
			op.w_shift(R,1,A,2,A,13);
			op.w_shift(R,0,R,1,A,22);
		}
	}
})();

function hmac_sha2(type,data,key)
{
	var config={
		'224':[64,28], //[blockSize, outputSize]
		'256':[64,32],
		'384':[128,48],
		'512':[128,64],
		'512/224':[128,28],
		'512/256':[128,32]
	};
	if(!config[type])
		return false;
	var blockSize=config[type][0],
	    outputSize=config[type][1];
	if(key.length>blockSize){
		key=sha2(type,key);
	}
	if(key.length<blockSize){
		let t=new Uint8Array(blockSize);
		t.set(key);
		key=t;
	}
	var o_key_pad=new Uint8Array(blockSize+outputSize);
	o_key_pad.set(key);
	var i_key_pad=new Uint8Array(blockSize+data.length);
	i_key_pad.set(key);
	for(let i=0;i<blockSize;++i){
		o_key_pad[i]^=0x5C;
		i_key_pad[i]^=0x36;
	}
	i_key_pad.set(data,blockSize);
	var t=sha2(type,i_key_pad);
	o_key_pad.set(t,blockSize);
	return sha2(type,o_key_pad);
}
/*
//產生 h_xxx 的base64
(function Hex2Base64(){
	var data="c1059ed8367cd5073070dd17f70e5939ffc00b316858151164f98fa7befa4fa4";
	var n=(data.length>>1);
	var arr=new Uint8Array(n);
	for(let i=0;i<n;++i){
		arr[i]=parseInt(data.slice(i*2,i*2+2),16);
	}
	console.log(arr.encodeBase64());
})();
*/


