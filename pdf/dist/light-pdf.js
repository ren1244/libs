!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).lightPdf={})}(this,(function(e){"use strict";var t=Uint8Array,r=Uint16Array,n=Uint32Array,i=new t([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),s=new t([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),o=new t([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),a=function(e,t){for(var i=new r(31),s=0;s<31;++s)i[s]=t+=1<<e[s-1];var o=new n(i[30]);for(s=1;s<30;++s)for(var a=i[s];a<i[s+1];++a)o[a]=a-i[s]<<5|s;return[i,o]},f=a(i,2),u=f[0],h=f[1];u[28]=258,h[258]=28;for(var l=a(s,0)[1],c=new r(32768),p=0;p<32768;++p){var g=(43690&p)>>>1|(21845&p)<<1;g=(61680&(g=(52428&g)>>>2|(13107&g)<<2))>>>4|(3855&g)<<4,c[p]=((65280&g)>>>8|(255&g)<<8)>>>1}var v=function(e,t,n){for(var i=e.length,s=0,o=new r(t);s<i;++s)e[s]&&++o[e[s]-1];var a,f=new r(t);for(s=0;s<t;++s)f[s]=f[s-1]+o[s-1]<<1;if(n){a=new r(1<<t);var u=15-t;for(s=0;s<i;++s)if(e[s])for(var h=s<<4|e[s],l=t-e[s],p=f[e[s]-1]++<<l,g=p|(1<<l)-1;p<=g;++p)a[c[p]>>>u]=h}else for(a=new r(i),s=0;s<i;++s)e[s]&&(a[s]=c[f[e[s]-1]++]>>>15-e[s]);return a},d=new t(288);for(p=0;p<144;++p)d[p]=8;for(p=144;p<256;++p)d[p]=9;for(p=256;p<280;++p)d[p]=7;for(p=280;p<288;++p)d[p]=8;var y=new t(32);for(p=0;p<32;++p)y[p]=5;var m=v(d,9,0),w=v(y,5,0),b=function(e){return(e+7)/8|0},_=function(e,t,r){r<<=7&t;var n=t/8|0;e[n]|=r,e[n+1]|=r>>>8},P=function(e,t,r){r<<=7&t;var n=t/8|0;e[n]|=r,e[n+1]|=r>>>8,e[n+2]|=r>>>16},x=function(e,n){for(var i=[],s=0;s<e.length;++s)e[s]&&i.push({s:s,f:e[s]});var o=i.length,a=i.slice();if(!o)return[U,0];if(1==o){var f=new t(i[0].s+1);return f[i[0].s]=1,[f,1]}i.sort((function(e,t){return e.f-t.f})),i.push({s:-1,f:25001});var u=i[0],h=i[1],l=0,c=1,p=2;for(i[0]={s:-1,f:u.f+h.f,l:u,r:h};c!=o-1;)u=i[i[l].f<i[p].f?l++:p++],h=i[l!=c&&i[l].f<i[p].f?l++:p++],i[c++]={s:-1,f:u.f+h.f,l:u,r:h};var g=a[0].s;for(s=1;s<o;++s)a[s].s>g&&(g=a[s].s);var v=new r(g+1),d=T(i[c-1],v,0);if(d>n){s=0;var y=0,m=d-n,w=1<<m;for(a.sort((function(e,t){return v[t.s]-v[e.s]||e.f-t.f}));s<o;++s){var b=a[s].s;if(!(v[b]>n))break;y+=w-(1<<d-v[b]),v[b]=n}for(y>>>=m;y>0;){var _=a[s].s;v[_]<n?y-=1<<n-v[_]++-1:++s}for(;s>=0&&y;--s){var P=a[s].s;v[P]==n&&(--v[P],++y)}d=n}return[new t(v),d]},T=function(e,t,r){return-1==e.s?Math.max(T(e.l,t,r+1),T(e.r,t,r+1)):t[e.s]=r},E=function(e){for(var t=e.length;t&&!e[--t];);for(var n=new r(++t),i=0,s=e[0],o=1,a=function(e){n[i++]=e},f=1;f<=t;++f)if(e[f]==s&&f!=t)++o;else{if(!s&&o>2){for(;o>138;o-=138)a(32754);o>2&&(a(o>10?o-11<<5|28690:o-3<<5|12305),o=0)}else if(o>3){for(a(s),--o;o>6;o-=6)a(8304);o>2&&(a(o-3<<5|8208),o=0)}for(;o--;)a(s);o=1,s=e[f]}return[n.subarray(0,i),t]},M=function(e,t){for(var r=0,n=0;n<t.length;++n)r+=e[n]*t[n];return r},A=function(e,t,r){var n=r.length,i=b(t+2);e[i]=255&n,e[i+1]=n>>>8,e[i+2]=255^e[i],e[i+3]=255^e[i+1];for(var s=0;s<n;++s)e[i+s+4]=r[s];return 8*(i+4+n)},$=function(e,t,n,a,f,u,h,l,c,p,g){_(t,g++,n),++f[256];for(var b=x(f,15),T=b[0],$=b[1],R=x(u,15),U=R[0],j=R[1],L=E(T),B=L[0],C=L[1],F=E(U),O=F[0],S=F[1],z=new r(19),D=0;D<B.length;++D)z[31&B[D]]++;for(D=0;D<O.length;++D)z[31&O[D]]++;for(var K=x(z,7),k=K[0],I=K[1],N=19;N>4&&!k[o[N-1]];--N);var Y,q,G,H,J=p+5<<3,Q=M(f,d)+M(u,y)+h,V=M(f,T)+M(u,U)+h+14+3*N+M(z,k)+(2*z[16]+3*z[17]+7*z[18]);if(J<=Q&&J<=V)return A(t,g,e.subarray(c,c+p));if(_(t,g,1+(V<Q)),g+=2,V<Q){Y=v(T,$,0),q=T,G=v(U,j,0),H=U;var W=v(k,I,0);_(t,g,C-257),_(t,g+5,S-1),_(t,g+10,N-4),g+=14;for(D=0;D<N;++D)_(t,g+3*D,k[o[D]]);g+=3*N;for(var X=[B,O],Z=0;Z<2;++Z){var ee=X[Z];for(D=0;D<ee.length;++D){var te=31&ee[D];_(t,g,W[te]),g+=k[te],te>15&&(_(t,g,ee[D]>>>5&127),g+=ee[D]>>>12)}}}else Y=m,q=d,G=w,H=y;for(D=0;D<l;++D)if(a[D]>255){te=a[D]>>>18&31;P(t,g,Y[te+257]),g+=q[te+257],te>7&&(_(t,g,a[D]>>>23&31),g+=i[te]);var re=31&a[D];P(t,g,G[re]),g+=H[re],re>3&&(P(t,g,a[D]>>>5&8191),g+=s[re])}else P(t,g,Y[a[D]]),g+=q[a[D]];return P(t,g,Y[256]),g+q[256]},R=new n([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),U=new t(0),j=function(e,o,a,f,u,c){var p=e.length,g=new t(f+p+5*(1+Math.ceil(p/7e3))+u),v=g.subarray(f,g.length-u),d=0;if(!o||p<8)for(var y=0;y<=p;y+=65535){var m=y+65535;m>=p&&(v[d>>3]=c),d=A(v,d+1,e.subarray(y,m))}else{for(var w=R[o-1],_=w>>>13,P=8191&w,x=(1<<a)-1,T=new r(32768),E=new r(x+1),M=Math.ceil(a/3),j=2*M,L=function(t){return(e[t]^e[t+1]<<M^e[t+2]<<j)&x},B=new n(25e3),C=new r(288),F=new r(32),O=0,S=0,z=(y=0,0),D=0,K=0;y<p;++y){var k=L(y),I=32767&y,N=E[k];if(T[I]=N,E[k]=I,D<=y){var Y=p-y;if((O>7e3||z>24576)&&Y>423){d=$(e,v,0,B,C,F,S,z,K,y-K,d),z=O=S=0,K=y;for(var q=0;q<286;++q)C[q]=0;for(q=0;q<30;++q)F[q]=0}var G=2,H=0,J=P,Q=I-N&32767;if(Y>2&&k==L(y-Q))for(var V=Math.min(_,Y)-1,W=Math.min(32767,y),X=Math.min(258,Y);Q<=W&&--J&&I!=N;){if(e[y+G]==e[y+G-Q]){for(var Z=0;Z<X&&e[y+Z]==e[y+Z-Q];++Z);if(Z>G){if(G=Z,H=Q,Z>V)break;var ee=Math.min(Q,Z-2),te=0;for(q=0;q<ee;++q){var re=y-Q+q+32768&32767,ne=re-T[re]+32768&32767;ne>te&&(te=ne,N=re)}}}Q+=(I=N)-(N=T[I])+32768&32767}if(H){B[z++]=268435456|h[G]<<18|l[H];var ie=31&h[G],se=31&l[H];S+=i[ie]+s[se],++C[257+ie],++F[se],D=y+G,++O}else B[z++]=e[y],++C[e[y]]}}d=$(e,v,c,B,C,F,S,z,K,y-K,d),!c&&7&d&&(d=A(v,d+1,U))}return function(e,i,s){(null==i||i<0)&&(i=0),(null==s||s>e.length)&&(s=e.length);var o=new(2==e.BYTES_PER_ELEMENT?r:4==e.BYTES_PER_ELEMENT?n:t)(s-i);return o.set(e.subarray(i,s)),o}(g,0,f+b(d)+u)},L=function(){var e=1,t=0;return{p:function(r){for(var n=e,i=t,s=0|r.length,o=0;o!=s;){for(var a=Math.min(o+2655,s);o<a;++o)i+=n+=r[o];n=(65535&n)+15*(n>>16),i=(65535&i)+15*(i>>16)}e=n,t=i},d:function(){return(255&(e%=65521))<<24|e>>>8<<16|(255&(t%=65521))<<8|t>>>8}}},B=function(e,t,r,n,i){return j(e,null==t.level?6:t.level,null==t.mem?Math.ceil(1.5*Math.max(8,Math.min(13,Math.log(e.length)))):12+t.mem,r,n,!i)},C=function(e,t,r){for(;r;++t)e[t]=r,r>>>=8},F=function(e,t){var r=t.level,n=0==r?0:r<6?1:9==r?3:2;e[0]=120,e[1]=n<<6|(n?32-2*n:1)};var O="undefined"!=typeof TextDecoder&&new TextDecoder;try{O.decode(U,{stream:!0}),1}catch(e){}function S(e,t,r){this.entries="object"==typeof e?e:{},this.stream="string"==typeof t||t instanceof Uint8Array?t:null,this.nocompress=!!r}S.prototype._parsePdfContent=function(e){function t(r){if("string"==typeof r||"number"==typeof r)return r;if(r instanceof S)return void 0!==r.id?`${r.id} 0 R`:(e.push(r),r.id=e.length,`${e.length} 0 R`);if(Array.isArray(r)){let e=r.length,n=[];for(let i=0;i<e;++i)n.push(t(r[i]));return`[ ${n.join(" ")} ]`}if(r instanceof Object&&r.constructor===Object){let e=[];for(let n in r)e.push(`/${n} ${t(r[n])}`);return`<< ${e.join(" ")} >>`}throw"未知的類型"}("string"==typeof this.stream||this.stream instanceof Uint8Array)&&(this.nocompress||("string"==typeof this.stream&&(this.stream=(new TextEncoder).encode(this.stream)),this.stream=function(e,t){t||(t={});var r=L();r.p(e);var n=B(e,t,2,4);return F(n,t),C(n,n.length-4,r.d()),n}(this.stream,{level:9}))),this.stream instanceof Uint8Array?(this.entries.Length=this.stream.byteLength,Array.isArray(this.entries.Filter)||(this.entries.Filter=[]),this.nocompress||this.entries.Filter.push("/FlateDecode")):"string"==typeof this.stream&&(this.entries.Length=this.stream.length);const r=this.id,n=this.entries;let i=[`${r} 0 obj\n`];i.push("<<\n");for(let e in n)i.push(`/${e} ${t(n[e])}\n`);return i.push(">>\n"),("string"==typeof this.stream||this.stream instanceof Uint8Array)&&(i.push("stream\n"),i.push(this.stream),i.push("\nendstream\n")),i.push("endobj\n"),this.entries=null,this.stream=null,i},S.finalize=function(e,t){let r;Array.isArray(e)?(r=e,e=r[0]):r=[e],t&&r.push(t),r.forEach(((e,t)=>{e.id=t+1}));let n=0;for(;n<r.length;)r[n]=r[n]._parsePdfContent(r),++n;let i=["%PDF-1.7\n%§§\n"],s=i[0].length+2,o=[];return r.forEach((e=>{o.push(s),e.forEach((e=>{s+=e instanceof Uint8Array?e.byteLength:e.length,i.push(e)}))})),r=null,i.push("xref\n"),i.push(`0 ${o.length+1}\n`),i.push("0000000000 65535 f \n"),o.forEach((e=>{let t=e.toString();t="0".repeat(10-t.length)+t,i.push(`${t} 00000 n \n`)})),i.push("trailer\n"),i.push("<<\n"),i.push(`/Size ${o.length+1}\n`),i.push(`/Root ${e.id} 0 R\n`),t&&i.push(`/Info ${t.id} 0 R\n`),i.push(">>\n"),i.push("startxref\n"),i.push(`${s}\n`),i.push("%%EOF\n"),i};const z=5;function D(e,...t){if((e=e.split("{}")).length!==t.length+1)throw"格式化字串錯誤";let r,n=[];for(r=0;r<t.length;++r){n.push(e[r]);let i=t[r];if("number"==typeof i){i=i.toFixed(z);let e=i.lastIndexOf(".");if(e>-1){let t=i.length;for(;48===i.codePointAt(t-1);)--t;e+1===t&&--t,i=i.slice(0,t)}}n.push(i)}return n.push(e[r]),n.join("")}function K(){this._catalog=new S({Type:"/Catalog",Pages:null}),this._pageTree=new S({Type:"/Pages",Kids:[],Count:0}),this._catalog.entries.Pages=this._pageTree,this._currentPage=null,this._resources={}}K.prototype.addPage=function(e,t){this._currentPage=new S({Type:"/Page",Parent:this._pageTree,Resources:{},Contents:[],MediaBox:[0,0,72*e/25.4,72*t/25.4]}),this._pageTree.entries.Kids.push(this._currentPage),++this._pageTree.entries.Count},K.prototype.getPageSize=function(){return null===this._currentPage?null:this._currentPage.entries.MediaBox.slice(2)},K.prototype.write=function(e){this._currentPage.entries.Contents.push(new S({},e))},K.prototype.getResource=function(e,t){return this._resources[e]&&this._resources[e][t]?this._resources[e][t]:null},K.prototype.addResource=function(e,t,r){const n=this._currentPage.entries.Resources;n[e]||(n[e]={}),n[e][t]=r},K.prototype.output=function(e){this._pageTree.entries.Kids.forEach((e=>{e.entries.MediaBox=e.entries.MediaBox.map((e=>D("{}",e)))}));let t=S.finalize(this._catalog);switch(e){case"blob":return new Blob(t,{type:"application/pdf"});case"url":return URL.createObjectURL(new Blob(t,{type:"application/pdf"}));case"array":let e=t.map((e=>"string"==typeof e?(new TextEncoder).encode(e):e)),r=e.reduce(((e,t)=>e+t.byteLength),0),n=e.reduce(((e,t)=>(e.arr.set(t,e.idx),e.idx+=t.byteLength,e)),{idx:0,arr:new Uint8Array(r)});return n.arr;default:return t}},e.Pdf=K,e.fmtstr=D}));
