var crypto = require('crypto')

var Encrypt = function (options) {
  this.checkParams(options)
  this.appId = options.appId
  this.encodingAESKey = options.encodingAESKey
  this.token = options.token
  this.aesKey = this.getAesKey(this.encodingAESKey)
  this.iv = this.getIv(this.aesKey)
}

Encrypt.prototype = {
  checkParams: function (options) {
    var keys = ['appId', 'encodingAESKey', 'token']
    keys.forEach(function (key) {
      if (typeof options[key] !== 'string') {
        throw new Error('Encrypt constructor() params is all String')
      }
    })
  },
  getAesKey: function (encodingAESKey) {
    return Buffer.from(encodingAESKey + '=', 'base64')
  },
  getIv: function (aesKey) {
    return aesKey.slice(0, 16)
  },
  encode: function (xmlMsg) {
    if (typeof xmlMsg !== 'string') {
      throw new TypeError('encode() required a String!')
    }
    var random = crypto.randomFillSync(Buffer.alloc(16))
    var buf = Buffer.from(xmlMsg)
    var msgLength = Buffer.alloc(4)
    msgLength.writeUInt32BE(buf.length, 0)
    var idBuf = Buffer.from(this.appId)
    var xmlBuf = Buffer.from(xmlMsg)
    var totalBuf = Buffer.concat([random, msgLength, xmlBuf, idBuf])
    totalBuf = this.PKCS7Encode(totalBuf)
    var cipher = crypto.createCipheriv('aes-256-cbc', this.aesKey, this.iv)
    cipher.setAutoPadding(false)
    var encryptBuf = Buffer.concat([cipher.update(totalBuf), cipher.final()])
    return encryptBuf.toString('base64')
  },
  decode: function (encryptMsg) {
    if (typeof encryptMsg !== 'string') {
      throw new TypeError('decode() required a String!')
    }
    var decipher = crypto.createDecipheriv('aes-256-cbc', this.aesKey, this.iv)
    decipher.setAutoPadding(false)
    var decipherBuffer = Buffer.concat([decipher.update(encryptMsg, 'base64'), decipher.final()])
    decipherBuffer = this.PKCS7Decode(decipherBuffer)
    var msgLength = decipherBuffer.slice(16, 20).readUInt32BE(0)
    var result = decipherBuffer.slice(20, msgLength + 20).toString()
    return result
  },
  getSignature: function (data) {
    var str = ([
      data.nonce,
      data.timestamp,
      data.msg_encrypt,
      this.token
    ]).sort().join('')

    return crypto.createHash('sha1').update(str).digest('hex')
  },
  verify: function (data) {
    var msg_signature = data.msg_signature
    var result = this.getSignature(data)
    return result === msg_signature
  },
  PKCS7Decode: function (buf) {
    var len = buf[buf.length - 1]
    if (len < 1 || len > 32) {
      len = 0
    }
    return buf.slice(0, buf.length - len)
  },
  PKCS7Encode: function (buf) {
    var blockSize = 32
    var len = buf.length
    var paddingLength = blockSize - (len % blockSize)
    var paddingBuffer = Buffer.alloc(paddingLength, paddingLength)
    return Buffer.concat([buf, paddingBuffer])
  }
}

module.exports = Encrypt