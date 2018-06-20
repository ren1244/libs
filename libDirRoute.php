<?php
/*
版本：1.0.0
用途：
	透過結構化的參數建立多層資料網站，用來處理不同回應需要回傳的頁面

使用範例：
========.htaccess========
RewriteEngine On
RewriteRule ^([\w/]*)$ index.php?dir=$1
========index.php========
<?php
require_once("route.php");

//網站結構
$route_conf=
["title"=>"主頁","url"=>"main.php","next"=>[
	"org"=>["title"=>"組織","url"=>"classA.php","next"=>[
		"A"=>["title"=>"A部門","url"=>"classA-1.php","next"=>null],
		"B"=>["title"=>"B部門","url"=>"classA-2.php","next"=>null]
	]],
	"map"=>["title"=>"網站地圖","url"=>"siteMap.php","next"=>null]
]];

//取得路徑參數(需使用 url rewrite)
$route_path=isset($_REQUEST['dir'])?$_REQUEST['dir']:"";


//以下是正式使用 route 物件

//(1)建立物件(第二個參數可以決定 route_conf 中的 url 前綴，方便放不同資料夾)
$r=new route($route_conf,"view/");
//(2)將url參數設定給 route 物件來解析
$r->setPath($route_path);
//(3)顯示該頁面
$viewUrl=$r->getViewUrl();
if($viewUrl)
	include($viewUrl);
else
{
	header('HTTP/1.0 404 not found');
	echo "404 not found";
}
*/

class route
{
	private $conf;
	private $url_root;
	private $path_array;
	function __construct($conf,$urlPrefix="")
	{
		$this->conf=$conf;
		$this->url_prefix=$urlPrefix;
		$this->path_array=false;
		//$this->path_array=false;
	}
	public function setPath($path_str)
	{//將 path_str 轉換為 path_array
		$arr=explode("/",$path_str);
		$cur=$this->conf;
		$cur_url=substr($_SERVER["PHP_SELF"],0,strrpos($_SERVER["PHP_SELF"],"/")+1);;
		$n=count($arr);
		$this->path_array=[["title"=>$cur["title"],"url"=>$cur["url"],"url2"=>$cur_url]];
		foreach($arr as $v)
		{
			if($v=="")
				continue;
			if(!isset($cur["next"][$v]))
			{
				$this->path_array=false;
				return false;
			}
			$cur=$cur["next"][$v];
			$cur_url.=$v."/";
			$this->path_array[]=["title"=>$cur["title"],"url"=>$cur["url"],"url2"=>$cur_url];
		}
		return true;
	}
	public function getViewUrl()
	{//取得 conf 中對應的 path 
		if($this->path_array)
		{
			$url=$this->url_prefix.$this->path_array[count($this->path_array)-1]["url"];
			if(file_exists($url))
			{
				return $url;
			}
		}
		return false;
	}
	//下面這個是產生導覽列，也許可以透過繼承來擴充而不寫在這
	/*public function echoNavPath()
	{
		$arr=$this->path_array;
		foreach($arr as $i=>$v)
		{
			echo ($i>0?" > ":"")."<a href='".$v["url2"]."'>".$v["title"]."</a>";
		}
	}*/
}
