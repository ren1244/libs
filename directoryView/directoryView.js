let createDir=(function(){
	let icons=false;
	let root;
	return function(containerId, dir, fileClickCallback)
	{
		let ct=document.getElementById(containerId);
		if(!icons){
			ct.innerHTML='<ul><li><span class="directory">M</span></li></ul>';
			let span=ct.getElementsByClassName('directory')[0];
			let edge=span.getBoundingClientRect().height;
			let color=getComputedStyle(span)['color'];
			ct.innerHTML='';
			icons={
				'close':loadIcon(edge, color, 0),
				'open':loadIcon(edge, color, 1)
			}
		}
		let previousStatus={};
		if(root){
			recordStatus(previousStatus ,root);
			ct.removeChild(root);
		}
		root=document.createElement('ul');
		appendContent(root, dir, previousStatus);
		ct.appendChild(root);
		function appendContent(p, arr, statusArr)
		{
			for(let i=0; i<arr.length; ++i) {
				let ele=arr[i],li,txt,ul,img;
				switch(ele.type) {
				case 'file':
					li=document.createElement('li');
					txt=document.createElement('span');
					txt.className='file'
					txt.textContent=ele.name;
					if(ele.value!==undefined){
						li.dataset.value=ele.value;
					}
					li.appendChild(txt);
					p.appendChild(li);
					if(fileClickCallback){
						li.addEventListener('click', onClickFile);
					}
					break;
				case 'dir':
					li=document.createElement('li');
					txt=document.createElement('span');
					img=document.createElement('img');
					txt.className='directory'
					txt.textContent=ele.name;
					li.appendChild(img);
					li.appendChild(txt);
					p.appendChild(li);
					ul=document.createElement('ul');
					if(statusArr && statusArr[ele.name]){
						if(statusArr[ele.name].open){
							img.src=icons['open'];
							ul.style.display='';
							li.dataset.open=1;
						} else {
							img.src=icons['close'];
							ul.style.display='none';
							li.dataset.open=0;
						}
						appendContent(ul, ele.children, statusArr[ele.name].next);
					} else {
						img.src=icons['close'];
						ul.style.display='none';
						appendContent(ul, ele.children, null);
						li.dataset.open=0;
					}
					li.appendChild(ul);
					li.addEventListener('click',onClickDir);
					break;
				default:
					console.log(ele);
				}
			}
		}
		
		function onClickDir(evt)
		{
			evt.stopPropagation();
			let li=this;
			let img=li.getElementsByTagName('img')[0];
			let ul=li.getElementsByTagName('ul')[0];
			if(ul.style.display==='none'){
				li.dataset.open=1;
				img.src=icons['open'];
				ul.style.display='';
			} else {
				li.dataset.open=0;
				img.src=icons['close'];
				ul.style.display='none';
			}
		}
		
		function onClickFile(evt)
		{
			evt.stopPropagation();
			let val=this.dataset.value!==undefined?this.dataset.value:this.getElementsByTagName('span')[0].textContent;
			fileClickCallback(val);
		}
		
		function loadIcon(sz, color, mode)
		{
			let r=(sz-1)/2;
			let t1=r/2,t2=r/2*Math.sqrt(3);
			let c1=sz/2,c2=sz/2-(sz-1-r*1.5)/2;
			let svg='<svg width="'+sz+'" height="'+sz+'" xmlns="http://www.w3.org/2000/svg">';
			if(mode) {
				svg+='<path d="M '+(c1)+','+(c2+r)+' L '+(c1-t2)+','+(c2-t1)+' '+(c1+t2)+','+(c2-t1)+' z" style="stroke:none;fill:'+color+'"/>';
			} else {
				svg+='<path d="M '+(c2+r)+','+(c1)+' L '+(c2-t1)+','+(c1-t2)+' '+(c2-t1)+','+(c1+t2)+' z" style="stroke:none;fill:'+color+'"/>';
			}
			svg+='</svg>';
			let blob=new Blob([svg],{type:'image/svg+xml'});
			return URL.createObjectURL(blob);
		}
		
		function recordStatus(arr, ul)
		{
			let list=ul.children;
			for(let i=0;i<list.length;++i){
				let li=list[i];
				if(li.dataset.open===undefined){
					continue;
				}
				let x={};
				x.open=parseInt(li.dataset.open,10);
				x.next={};
				recordStatus(x.next, li.getElementsByTagName('ul')[0]);
				arr[li.getElementsByTagName('span')[0].textContent]=x;
			}
		}
	}
})();
