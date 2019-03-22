## 用途

產生像是文件夾那種多層結構的選單。

## 使用

### 把資料呈現到容器

	createDir(containerId, fileStruct, callback);

* containerId：容器的 id
* fileStruct：描述檔案結構的 object
	* name：檔案名稱或資料夾名稱
	* type：`'file'` 或 `'dir'`
	* value：當 type 為 `'file'` 時的選擇性屬性。作為使用者點選後將會丟給 callback 的參數，如果沒有設定，會以 name 作為參數丟給 callback。
	* children：當 type 為 `'dir'` 時一定要有的屬性，為一個陣列，代表該資料夾的內容。如果該資料夾為空資料夾請設定為空陣列 `[]`。

### 更新資料夾內容

當資料夾發生異動，重新呼叫 createDir 即可。

對於新的路徑存在與原先路徑相同的部分，程式會保持原先是否被點開的狀態。

## 範例

參考 example.html
