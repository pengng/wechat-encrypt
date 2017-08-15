# wechat-encrypt

WeChat open platform session message encryption and decryption module.

微信开放平台会话消息加解密模块。

### Usage

```bash
npm install wechat-encrypt -S
```

```javascript
const Encrypt = require('wechat-encrypt')

const encrypt = new Encrypt({
  appId: 'wxf1569d816b304d28',
  encodingAESKey: 'WO3Gcs2X5lcNtZagAcaRRjNaAwEmoekP1P2aOKR4W3D',
  token: 'weixin'
})

// How to decode message

console.log(Http_body)

/*
<xml>
    <ToUserName><![CDATA[gh_3db049ae940a]]></ToUserName>
    <Encrypt><![CDATA[XpHWFFBEWSZBmKJvj03anXGY5dEViwYBBnTaPyUkoKzPm1fxcCEv0BwvX+7EFywVTkwQNqFpBqKZj23vJ1QgXi2SshJyvov1hiGfSTIUi2dWpoqH8I2Zhw9XwIkzrOnitGb3vdUAVkSwRTBWtxyTIg3JJPVJPwpLXTYUR+4G2wk5+SIVhBNoepGx7ZwUHK5Sv8ReEDDBwzeFlHl2SAeNA6sH+jvnY8mwNUOxe2fGXge0TteO3U6UWpExJeYuPQIrqNofLcAbPUr7IVkfsm2jqBIH6gWxddNA9U+N0lbQgqKR3LTClM+9GLQFUNLgY7WFyeoZDTIoj8F06uHQTqVd6sGETnFp+c0ff2UQb9bEkJWpZOKnA0cKacw7JyiOUfYmETAdSk6ffULXzqYOYCYlSLxzuFkfO62/hmiHGaMslGNYtwx5Zv31G9kd+Qi1SpGaYJn2q5McnTmht3ptyTyvmQ==]]></Encrypt>
</xml>
*/

const xmlMsg = encrypt.decode('XpHWFFBEWSZBmKJvj03anXGY5dEViwYBBnTaPyUkoKzPm1fxcCEv0BwvX+7EFywVTkwQNqFpBqKZj23vJ1QgXi2SshJyvov1hiGfSTIUi2dWpoqH8I2Zhw9XwIkzrOnitGb3vdUAVkSwRTBWtxyTIg3JJPVJPwpLXTYUR+4G2wk5+SIVhBNoepGx7ZwUHK5Sv8ReEDDBwzeFlHl2SAeNA6sH+jvnY8mwNUOxe2fGXge0TteO3U6UWpExJeYuPQIrqNofLcAbPUr7IVkfsm2jqBIH6gWxddNA9U+N0lbQgqKR3LTClM+9GLQFUNLgY7WFyeoZDTIoj8F06uHQTqVd6sGETnFp+c0ff2UQb9bEkJWpZOKnA0cKacw7JyiOUfYmETAdSk6ffULXzqYOYCYlSLxzuFkfO62/hmiHGaMslGNYtwx5Zv31G9kd+Qi1SpGaYJn2q5McnTmht3ptyTyvmQ==')

console.log(xmlMsg)

/*
<xml><ToUserName><![CDATA[gh_3db049ae940a]]></ToUserName>
<FromUserName><![CDATA[ozKDGv3BQsXV2WDNDynsLnueAujU]]></FromUserName>
<CreateTime>1502784210</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[Hello World!]]></Content>
<MsgId>6454409035319957426</MsgId>
</xml>
*/

// How to encode message

const encodeStr = encrypt.encode(xmlMsg)
console.log(encodeStr)

/*
XpHWFFBEWSZBmKJvj03anXGY5dEViwYBBnTaPyUkoKzPm1fxcCEv0BwvX+7EFywVTkwQNqFpBqKZj23vJ1QgXi2SshJyvov1hiGfSTIUi2dWpoqH8I2Zhw9XwIkzrOnitGb3vdUAVkSwRTBWtxyTIg3JJPVJPwpLXTYUR+4G2wk5+SIVhBNoepGx7ZwUHK5Sv8ReEDDBwzeFlHl2SAeNA6sH+jvnY8mwNUOxe2fGXge0TteO3U6UWpExJeYuPQIrqNofLcAbPUr7IVkfsm2jqBIH6gWxddNA9U+N0lbQgqKR3LTClM+9GLQFUNLgY7WFyeoZDTIoj8F06uHQTqVd6sGETnFp+c0ff2UQb9bEkJWpZOKnA0cKacw7JyiOUfYmETAdSk6ffULXzqYOYCYlSLxzuFkfO62/hmiHGaMslGNYtwx5Zv31G9kd+Qi1SpGaYJn2q5McnTmht3ptyTyvmQ==
*/
```

### new Encrypt(options)

##### options 参数
| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| appId | String | 是 | 微信公众号appId。 |
| token | String | 是 | 微信公众号后台设置的token。 |
| encodingAESKey | String | 是 | 微信公众号后台设置的encodingAESKey。 |

### 方法

- [encode](#encode)
- [decode](#decode)
- [verify](#verify)
- [getSignature](getSignature)

###### encode

`encode(xmlMsg)` 传入xml文本，返回加密后的base64字符串。

##### decode

`decode(msg_encrypt)` 传入微信请求body中的Encrypt字段值，返回解密后的xml字符串。

##### verify

`verify(data)` 检验消息的完整性。传入微信请求`query`中的`timestamp`, `nonce`, `msg_signature`和请求`body`中的`Encrypt` 返回检验结果`true`或`false`。

##### data 参数

| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| timestamp | String | 是 | 请求query中的timestamp。 |
| nonce | String | 是 | 请求query中的nonce。 |
| msg_signature | String | 是 | 请求query中的msg_signature。 |
| msg_encrypt | String | 是 | 请求body中的Encrypt。 |

