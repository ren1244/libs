(function (){
	var methods=['FullYear','Month','Date','Day','Hours','Minutes','Seconds','Milliseconds'];
	var types=['get','set'];
	var i,j;
	for(i in methods){
		for(j in types){
			if(!Date.prototype[types[j]+'UTC'+methods[i]]){
				continue;
			}
			Date.prototype[types[j]+'GMT'+methods[i]]=(function(funcName){
				return (function(hourOffset,x){
					this.setTime(this.getTime()+hourOffset*3600000);
					var r=this[funcName](x);
					this.setTime(this.getTime()-hourOffset*3600000);
					return r;
				});
			})(types[j]+'UTC'+methods[i]);
		}
	}
})();