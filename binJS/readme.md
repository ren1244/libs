# binJS

處理字串與二進位資料的變換，並提供：

* sha2 家族的雜湊
* aes 加密

## 使用

引入 binJS.min.js

	<script src="binJS.min.js"></script>

接著可以透過下列方式取值

	BinJS(data).方法(...).方法(...).....方法(...).val();

### 範例
	
對字串 "abc" 計算 sha256 雜湊

	hashVal = BinJS("abc").bin().sha2("256").str("hex").val();

上面的例子中：

1. 先透過 bin 方法將字串 "abc" 轉換為二進位資料。
2. 再用 sha2('256') 對其取 sha256 的雜湊值（取完雜湊後還是二進位資料）。
3. 用 str 方法將二進位資料轉為十六進位字串。
4. 用 val 方法取得最後的結果。

如果不希望以16進位字串呈現，想直接取得二進位資料，可以用：

	hashVal = BinJS("abc").bin().sha2("256").val();

如此一來，hashVal 將會是一個 Uint8Array，內容為雜湊值。

### 概念

* 在使用上，只要知道目前的東西是「字串」還是「二進位資料」。
* 透過 bin 及 str 兩個方法，可以用不同的編碼方式，在「字串」與「二進位資料」之間轉換。
* 上面提到的「二進位資料」，實際上是 Uint8Array。
* 由於 bin 及 str 兩個方法都是回傳物件（該物件紀錄的當前的狀態），所以可以一直接不同的方法。
* 想從物件中取出當前的值，可透過 val 方法。

## 方法

| 方法 | 說明 | 回傳值 | 分類
|:--:|:--:|:--:|:--:|
| bin | 將字串轉為二進位資料 | BinJSBase 物件 | 基本 |
| str | 將二進位資料轉為字串 | BinJSBase 物件 | 基本 |
| val | 取得物件中的值 | string 或 Uint8Array | 基本 |
| sha2 | 對二進位資料取雜湊 | BinJSBase 物件 | 雜湊 |
| hmac_sha2 | 對二進位資料取金鑰雜湊 | BinJSBase 物件 | 雜湊 |
| cipher | 對二進位資料加密 | BinJSBase 物件 | 對稱加密 |
| decipher | 對二進位資料解密 | BinJSBase 物件 | 對稱加密 |

### bin

將字串轉為二進位資料

| 參數 | 資料型態 | 說明 |
|:--:|:--:|:--:|
| codec | string | 編碼，可以是 `'utf8'`、`'base64'`、`'hex'`。如果省略，預設為 `'utf8'` |

| 回傳 | 說明 |
|:--:|:--:|
| BinJSBase 物件 | 同 BinJS(data) 產生的物件，可繼續串接其他方法  |

### str

將二進位資料轉為字串

| 參數 | 資料型態 | 說明 |
|:--:|:--:|:--:|
| codec | string | 編碼，可以是 `'utf8'`、`'base64'`、`'hex'`。如果省略，預設為 'utf8' |

| 回傳 | 說明 |
|:--:|:--:|
| BinJSBase 物件 | 同 BinJS(data) 產生的物件，可繼續串接其他方法  |

### val

取出 BinJSBase 物件中的值

| 回傳 | 說明 |
|:--:|:--:|
| string 或 Uint8Array | 根據狀態的不同，回傳 string 或 Uint8Array |

### sha2

對二進位資料取雜湊。<br>如果BinJSBase 物件當前狀態是字串，則會預設以 utf8 方式先轉為 Uint8Array 再做雜湊。

| 參數 | 資料型態 | 說明 |
|:--:|:--:|:--:|
| hashType | string | 雜湊方式，可以是 `'224'`、`'256'`、`'384'`、`'512'`、`'512/225'`、`'512/256'`。|

| 回傳 | 說明 |
|:--:|:--:|
| BinJSBase 物件 | 同 BinJS(data) 產生的物件，可繼續串接其他方法  |

### hmac_sha2

對二進位資料取金鑰雜湊。<br>如果BinJSBase 物件當前狀態是字串，則會預設以 utf8 方式先轉為 Uint8Array 再做雜湊。

| 參數 | 資料型態 | 說明 |
|:--:|:--:|:--:|
| hashType | string | 雜湊方式，可以是 `'224'`、`'256'`、`'384'`、`'512'`、`'512/225'`、`'512/256'`。|
| key | Uint8Array<br>(或 string) | 金鑰。如果是 string，則會以 utf8 方式轉為 Uint8Array。|

| 回傳 | 說明 |
|:--:|:--:|
| BinJSBase 物件 | 同 BinJS(data) 產生的物件，可繼續串接其他方法  |

### cipher

對二進位資料加密。<br>如果BinJSBase 物件當前狀態是字串，則會預設以 utf8 方式先轉為 Uint8Array 再做處理。

| 參數 | 資料型態 | 說明 |
|:--:|:--:|:--:|
| type | string | 塊鏈結與padding 類型，可以是 `'aes_cbc_zero'`、`'aes_cbc_pkcs7'` |
| key | Uint8Array | 金鑰。依據長度的不同，會採用不同的加密方式。 |
| iv | Uint8Array | 初始向量。其長度必須為16 |

關於 key 長度與加密方式的關係：

* 長度 16 是 AES 128
* 長度 24 是 AES 192
* 長度 32 是 AES 256

| 回傳 | 說明 |
|:--:|:--:|
| BinJSBase 物件 | 同 BinJS(data) 產生的物件，可繼續串接其他方法  |

### decipher

對二進位資料解密。<br>如果BinJSBase 物件當前狀態是字串，則會預設以 utf8 方式先轉為 Uint8Array 再做處理。

參數與回傳值同 cipher 方法。
