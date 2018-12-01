## 用途

前端需要透過 ajax 取得遠端的大檔案。這邊可以將大檔案分割為較小的檔案，並轉換為 png 圖檔，再透過 dataloder.js 讀取。

好處有下列兩點：

1. 瀏覽器有機會對這些 png 圖檔 cache，節約資源。
2. png 本身有壓縮資料，因此對於適合壓縮的檔案也可以降低檔案大小。

## 使用方式

* 將資料轉為 png 圖檔：
	1. 在命令列執行 `php data2png.php input_file prefix` ，這會把資料轉換為 prefix 開頭的 png 檔案。
* 瀏覽器讀取檔案：
	1. 引入 dataloder.js
	2. 建立 DataLoader 物件後，用 read 方法取得遠端的檔案（必須由 data2png.php 產生）。

可參考下列範例。

## 範例

這個範例是對 TW-Kai-98_1.ttf 這個字型檔案處理

在命令列下

	php data2png.php TW-Kai-98_1.ttf kai

JavaScript

	var loder = new DataLoader();
	loder.read([
		"kai00.png", //png 檔的 url，相對/絕對路徑都可
		"kai01.png",
		"kai02.png",
		...  //看有幾個檔案就寫幾個
	],function(u8arr){
		//當讀取完成後，要呼叫的 callback ，傳回來的是一個 Uint8Array
	});