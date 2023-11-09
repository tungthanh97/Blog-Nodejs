'use strict'

const keyTokenModel = require('../models/keyToken.model')

class KeyTokenService {
    // QUESTION: WHY static
    static createKeyToken = async ({ userId, publicKey }) => {
        try {
            const publicKeyString = publicKey.toString()
            const tokens = await keyTokenModel.create({
                user: userId,
                publicKey: publicKeyString,
            })

            return tokens ? publicKeyString : null
        } catch (error) {
            return error
        }
    }
}

module.exports = KeyTokenService
