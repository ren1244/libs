<?php
/* 
version 1.1.0
新功能
1.增加auth檢查
2.增加第二個參數，可以取得中斷位置

example:

function funcVerify1($d)
{ //驗證函式，回傳boolen代表通過驗證與否
	echo "($d)";
	return true;
}

function funcCbk($v1,$v2)
{ //符合條件下執行的函式
	echo "@$v2 $v1@";
}

$cfg=[ //路由設定
	[
		'method'=>'GET',
		'parameters'=>[
			['cmd','#strCmd']
			['uid','funcVerify1'],
			['pwd','funcVerify1']
		],
		'auth'=>'funcAuthCheck',
		'callback'=>'funcCbk'
	]
];

route($cfg);
*/
function route($cfg,&$traceLog=null){
	foreach($cfg as $api)
	{
		//檢查 method 並設定 $req
		switch ($api['method']){
		case 'GET':
			$req=$_GET;
			break;
		case 'POST':
			$req=$_POST;
			break;
		case 'REQUEST':
			$req=$_REQUEST;
			break;
		case 'UPDATE':
			$req=$_UPDATE;
			break;
		default:
			if(!is_null($traceLog))
				$traceLog[]='method'; //開發人員使用錯誤
			return false;
		}
		$arr=[]; //儲存送入 callback 的函式
		//檢查 parameters
		for($i=0,$N=count($api['parameters']);$i<$N;++$i)
		{//檢查每一條都符合
			$pname=$api['parameters'][$i][0]; //parameter name
			$vfy=$api['parameters'][$i][1]; //vreify function or string
			if(!isset($req[$pname]))
				break;
			$pvalue=$req[$pname]; //parameter value
			if($vfy[0]=='#')
			{
				if(substr($vfy,1)!=$pvalue)
					break;
			}
			else
			{
				if(!($vfy($pvalue)))
					break;
				$arr[]=$pvalue;
			}
		}
		if($i!=$N) //parameter 不符合 此組 api 設定
		{
			if(!is_null($traceLog))
				$traceLog[]='parameter '.$i;
			continue;
		}
		//檢查auth
		if(isset($api['auth']) && !$api['auth']())
		{
			if(!is_null($traceLog))
				$traceLog[]='auth';
			continue;
		}
		//檢查完畢，執行callback
		call_user_func_array($api['callback'],$arr);
		if(!is_null($traceLog))
			$traceLog[]='call function '.$api['callback'].'('.implode($arr,',').')';
		return true;
	}
	return false;
}
?>
