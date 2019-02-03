# binJS

## 函式庫載入

### 個別載入

1. 核心函式庫：utf8b64.js
2. 選用模組函式庫(目前有sha2家族模組以及AES加密模組)
3. 簡化使用：easyuse.js

### 全部載入

直接載入 binJS.min.js 即可，這包含了所有的檔案。

## 基本使用

尚未載入其他選用模組的狀況之下，有以下方法可以使用

字串轉Uint8Array物件：

	字串.bin(編碼方式)

Uint8Array物件轉字串：

	Uint8Array.str(編碼方式)

編碼方式有：

* 'utf8'
* 'base64'
* 'hex'

### 範例

將字串 123 轉為 base64

	"123".bin('utf8').str('base64');

## sha2家族模組

選用模組需載入 sha2.js，有以下 2 個方法：

一般雜湊

	Uint8Array.sha2(雜湊類別);

hmac

	Uint8Array.hmac_sha2(雜湊類別,key);

key 可以是 Uint8Array 或是字串 ( 自動以utf8編碼轉為 key )

雜湊類別有：

* '224'
* '256'
* '384'
* '512'
* '512/225'
* '512/256'



## AES加密模組

選用模組需載入 aes.js 以及 aes_cbc_zero.js，有以下 2 個方法：

加密

	Uint8Array.cipher(加密方法,key);

解密

	Uint8Array.decipher(加密方法,key);

加密方法有：

* 'aes_cbc_zero'

key 必須是特定大小的 Uint8Array，其長度會決定採用 AES 的加密方法

* 長度 32 是 AES 128
* 長度 48 是 AES 192
* 長度 64 是 AES 256
