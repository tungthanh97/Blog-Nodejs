'use strict'

const { Types } = require('mongoose')
const keyTokenModel = require('../models/keyToken.model')

class KeyTokenService {
    // QUESTION: WHY static
    static createKeyToken = async ({
        userId,
        publicKey,
        privateKey,
        refreshToken,
    }) => {
        try {
            // level 0
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey,
            // })

            const filter = { user: userId },
                update = {
                    publicKey,
                    privateKey,
                    refreshTokensUsed: [],
                    refreshToken,
                },
                options = { upsert: true, new: true }
            const tokens = await keyTokenModel.findOneAndUpdate(
                filter,
                update,
                options
            )
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        console.log('userId', userId)
        const filter = { user: new Types.ObjectId(userId) }
        const tokens = await keyTokenModel.findOne(filter).lean()
        return tokens
    }

    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne({ _id: new Types.ObjectId(id) })
    }
}

module.exports = KeyTokenService
