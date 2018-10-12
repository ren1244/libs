/* 
Array.prototype.bsearch(value,cmpFunc)
參數
	value:要搜尋的值
	cmpFunc:比較值的函式
		其參數為兩個值 a,b
		回傳值為數值，數值為正代表a>b，0代表a=b，負代表a<b
		另外回傳值的絕對值大小代表a跟b之間的距離
回傳
	如果是空陣列回傳0，否則回傳最接近的值
注意
	陣列必須先排序過
範例
	var a=[2,3,5,7,11,13,15,17,19];
	console.log(a.bsearch(6,function(a,b){return a-b;}));
*/
Array.prototype.bsearch=function (value,cmpFunc)
{
	var iL=0,
	    iM=(this.length-1>>>1),
	    iR=this.length-1,
	    d1,d2,t;
	if(iR<0)
		return false;
	if(cmpFunc===undefined)
		cmpFunc=function (a,b){
			return a-b;
		}
	while(iL+1<iR)
	{
		t=cmpFunc(value,this[iM]);
		if(t==0)
			return this[iM];
		if(t<0)
			iR=iM;
		else
			iL=iM;
		iM=(iR+iL>>>1);
	}
	t=cmpFunc(value,this[iM]);
	if(t==0)
		return this[iM];
	d1=Math.abs(cmpFunc(value,this[iL]));
	d2=Math.abs(cmpFunc(value,this[iR]));
	return d1<=d2?this[iL]:this[iR];
}

