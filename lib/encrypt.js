const crypto = require('crypto')

const ALGORITHM = 'aes-256-cbc'     // 使用的加密算法
const MSG_LENGTH_SIZE = 4           // 存放消息体尺寸的空间大小。单位：字节
const RANDOM_BYTES_SIZE = 16        // 随机数据的大小。单位：字节
const BLOCK_SIZE = 32               // 分块尺寸。单位：字节

const Encrypt = function (params) {

    let { appId, encodingAESKey, token } = params
    let key = Buffer.from(encodingAESKey + '=', 'base64')       // 解码密钥
    let iv = key.slice(0, 16)                                   // 初始化向量为密钥的前16字节

    Object.assign(this, { appId, token, key, iv })
}

Encrypt.prototype = {
    /**
     * 加密消息
     * @param {string} msg 待加密的消息体
     */
    encode(msg) {
        let { appId, key, iv } = this
        let randomBytes = crypto.randomBytes(RANDOM_BYTES_SIZE)                     // 生成指定大小的随机数据

        let msgLenBuf = Buffer.alloc(MSG_LENGTH_SIZE)                               // 申请指定大小的空间，存放消息体的大小
        let offset = 0                                                              // 写入的偏移值
        msgLenBuf.writeUInt32BE(Buffer.byteLength(msg), offset)                     // 按大端序（网络字节序）写入消息体的大小

        let msgBuf = Buffer.from(msg)                                               // 将消息体转成 buffer
        let appIdBuf = Buffer.from(appId)                                           // 将 APPID 转成 buffer

        let totalBuf = Buffer.concat([randomBytes, msgLenBuf, msgBuf, appIdBuf])    // 将16字节的随机数据、4字节的消息体大小、若干字节的消息体、若干字节的APPID拼接起来

        let cipher = crypto.createCipheriv(ALGORITHM, key, iv)                      // 创建加密器实例
        cipher.setAutoPadding(false)                                                // 禁用默认的数据填充方式
        totalBuf = this.PKCS7Encode(totalBuf)                                       // 使用自定义的数据填充方式
        let encryptedBuf = Buffer.concat([cipher.update(totalBuf), cipher.final()])  // 加密后的数据

        return encryptedBuf.toString('base64')                                       // 返回加密数据的 base64 编码结果
    },

    /**
     * 解密消息
     * @param {string} encryptedMsg 待解密的消息体
     */
    decode(encryptedMsg) {
        let { key, iv } = this
        let encryptedMsgBuf = Buffer.from(encryptedMsg, 'base64')                                // 将 base64 编码的数据转成 buffer

        let decipher = crypto.createDecipheriv(ALGORITHM, key, iv)                              // 创建解密器实例
        decipher.setAutoPadding(false)                                                          // 禁用默认的数据填充方式
        let decryptedBuf = Buffer.concat([decipher.update(encryptedMsgBuf), decipher.final()])   // 解密后的数据

        decryptedBuf = this.PKCS7Decode(decryptedBuf)                                             // 去除填充的数据

        let msgSize = decryptedBuf.readUInt32BE(RANDOM_BYTES_SIZE)                               // 根据指定偏移值，从 buffer 中读取消息体的大小，单位：字节
        let msgBufStartPos = RANDOM_BYTES_SIZE + MSG_LENGTH_SIZE                                // 消息体的起始位置
        let msgBufEndPos = msgBufStartPos + msgSize                                             // 消息体的结束位置

        let msgBuf = decryptedBuf.slice(msgBufStartPos, msgBufEndPos)                            // 从 buffer 中提取消息体

        return msgBuf.toString()                                                                // 将消息体转成字符串，并返回数据
    },

    /**
     * 生成签名
     * @param {Object} params 待签名的参数
     */
    genSign(params) {
        let { token } = this
        let { timestamp, nonce, encrypt } = params

        let rawStr = [token, timestamp, nonce, encrypt].sort().join('')                         // 原始字符串
        let signature = crypto.createHash('sha1').update(rawStr).digest('hex')                  // 计算签名

        return signature
    },

    /**
     * 按 PKCS#7 的方式从填充过的数据中提取原数据
     * @param {Buffer} buf 待处理的数据
     */
    PKCS7Decode(buf) {
        let padSize = buf[buf.length - 1]                       // 最后1字节记录着填充的数据大小
        return buf.slice(0, buf.length - padSize)               // 提取原数据
    },

    /**
     * 按 PKCS#7 的方式填充数据结尾
     * @param {Buffer} buf 待填充的数据
     */
    PKCS7Encode(buf) {
        let padSize = BLOCK_SIZE - (buf.length % BLOCK_SIZE)    // 计算填充的大小。
        let fillByte = padSize                                  // 填充的字节数据为填充的大小
        let padBuf = Buffer.alloc(padSize, fillByte)            // 分配指定大小的空间，并填充数据
        return Buffer.concat([buf, padBuf])                     // 拼接原数据和填充的数据
    }
}

module.exports = Encrypt
