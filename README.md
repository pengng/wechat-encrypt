# wechat-encrypt

微信开放平台会话消息加解密模块。

### 示例代码

```bash
npm install wechat-encrypt
```

```javascript
const WechatEncrypt = require('wechat-encrypt')

const wechatEncrypt = new WechatEncrypt({
    appId: 'wx013591feaf25uoip',
    encodingAESKey: 'abcdefgabcdefgabcdefgabcdefgabcdefgabcdefg0',
    token: 'test token'
})

// 报文主体中 Encrypt 字段的值(注意微信推送消息体的格式为 XML)
let encrypt = 'elJAUQEY0yKnbLbmXYdacAoDEmJlzdMeB3ryWEtNOQnJ2n1h9Y0ocSYYsW8YsrVrWhJrZe4gKKrzMs1JBCHFNHlFYCMBigDMU41WGxjwulsLjglXd+Cr7Mq/RV7TUwkkqX9+y0KmIIqAl+qYJUnuYvaug5bBMcikP9kDj3OzQ41Oppt0hzNGq7tw6RFplSW75ItMVY6Vi0d+NJTLuvIWwQqDIytcVJnNQFHOTRmm9sUVVm0kNiQp7sQljoif+j/JjMkB1fQXtrwUkLup0ql4vGZ8/126qWFR8p8tmzbDm4U/tdgLYLnEv7XFMT6cmYprmEz3cyN2yWuRfKcCBOgKyUfEt+NYwnE+1l5QK2nbOkMqorqmvc66zo0VYVj4o8nV+laMy3Celz3rDUAJMKXk/FN8ZjOsyn7sDJlo8iAhHtg='
let timestamp = '1565268520' // 推送消息链接上的 timestamp 字段值
let nonce = '331748743'	// 推送消息链接上的 nonce 字段值
let msg_signature = 'f0d525f5e849b1cd8f628eff2121b4d16765b7f2' // 推送消息链接上 msg_signature 字段值

// 校验消息是否来自微信：取链接上的 timestamp, nonce 字段和报文主体的 Encrypt 字段的值，来生成签名
// 生成的签名和链接上的 msg_signature 字段值进行对比
let signature = wechatEncrypt.genSign({ timestamp, nonce, encrypt })
let isValid = signature === msg_signature
console.log(`该消息${isValid ? '有效' : '无效'}\n\n`)
/*
该消息有效

*/

// 解密消息内容。取报文主体的 Encrypt 字段的值进行解密
let xml = wechatEncrypt.decode(encrypt)
console.log(`解密后的消息：\n${xml}\n\n`)
/*
解密后的消息：
<xml><ToUserName><![CDATA[gh_fd189404d989]]></ToUserName><FromUserName><![CDATA[o9uKB5hniJXLYJTtfjxMSSmo477k]]></FromUserName><CreateTime>1565266686</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[Hello world]]></Content><MsgId>22409229427342621</MsgId></xml>
*/


// 加密消息。调用 encode 方法，传入待加密的内容，返回加密后的结果
let encryptedMsg = wechatEncrypt.encode(xml)
console.log(`加密后的结果：\n${encryptedMsg}\n\n`)
/*
加密后的结果：
uF/fQ1LOkmHC4defoc2+h1LxRFXh2dGu4CS71Nm7I2BrWglcchikzFJw1RN9ZsylVyow1kGBj7p9Mrg0m6VGdrSKZ/aCg04Yu9lCCY7YPukf7VpBR+iK8JNiproQTdnXWREar2UPWM06aGPmQTfVcjEN1K5oMA0tOxRFt2jDtjhwCptXw7qPALCT8fJILkjL7z8e//dMCtrrxeh0NENf3oM1AqZq7ZJ/iWHfCPp+hcxNJrNZlzLgKlIuFxb8QwppvA8KyOItM+RZkr286e1hPJqnCpelXrl9MzigrnGH+BjegkQQNrHBco093vrElrOJxYnlJwHOtr/kN54nngFal/Gn1+PRCrvVPxRKE2e/pwTbCMtUbVB+W3FKTnbGDfEvzBJzrPKYmT2Woio3hTjsYEb8Qk/fMc8A8myalD3CD8pjTAY0/dTmo3Iq4jwrhwQ9HnvGxliwZ25lWRxplwQDf4aB6kngfC4tZnrNuDKewUyWr7RKrpGjxV9OtzzbZBaa
*/
```

### WechatEncrypt(params)

**构造函数**

```javascript
let wechatEncrypt = new WechatEncrypt({ appId, token, encodingAESKey })
```

## 实例方法：

### encode(msg)

**加密消息**

```javascript
let encryptedMsg = wechatEncrypt.encode(rawMsg)
```

### decode(msg)

**解密消息**

```javascript
let decryptedMsg = wechatEncrypt.decode(encryptedMsg)
```

### genSign(params)

**生成签名 signature。用于校验消息是否来自微信。回复消息时也需要生成签名。**

```javascript
let signature = wechatEncrypt.genSign({ timestamp, nonce, encrypt })
```

