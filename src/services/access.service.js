'use strict'

const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError, AuthFailureError } = require('../core/error.response')
const { findByEmail } = require('./user.service')

// service ///

const RoleUser = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

class AccessService {
    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)

        console.log('delKey', delKey)
        return delKey
    }

    static login = async ({ email, password }) => {
        // 1. Check email in dbs
        const foundUser = await findByEmail({ email })
        if (!foundUser) throw new BadRequestError('Error: User not found')

        // 2. Match password
        const match = bcrypt.compare(password, foundUser.password)
        if (!match) throw new AuthFailureError('Authentication Error')

        // 3. Create AT and RT
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        // 4. Generate tokens
        const { _id: userId } = foundUser
        const tokens = await createTokenPair(
            { userId, email },
            publicKey,
            privateKey
        )

        await KeyTokenService.createKeyToken({
            userId,
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
        })

        return {
            user: getInfoData({
                fields: ['_id', 'name', 'email'],
                object: foundUser,
            }),
            tokens,
        }
    }

    static signUp = async ({ name, email, password }) => {
        // step1: check email exists??
        const holderUser = await userModel.findOne({ email }).lean()

        if (holderUser) {
            throw new BadRequestError('Error: User already exist')
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const newUser = await userModel.create({
            name,
            email,
            password: passwordHash,
            roles: [RoleUser.SHOP],
        })

        if (newUser) {
            // created privateKey, publicKey
            // const { privateKey, publicKey } = crypto.generateKeyPairSync(
            //     'rsa',
            //     {
            //         modulusLength: 4096,
            //         publicKeyEncoding: {
            //             type: 'pkcs1',
            //             format: 'pem',
            //         },
            //         privateKeyEncoding: {
            //             type: 'pkcs1',
            //             format: 'pem',
            //         },
            //     }
            // )

            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')

            console.log({ privateKey, publicKey })

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newUser._id,
                publicKey,
                privateKey,
            })

            if (!keyStore) {
                throw new BadRequestError('Error: Create publicKey failed')
            }

            // created token pair
            const tokens = await createTokenPair(
                { userId: newUser._id, email },
                publicKey,
                privateKey
            )
            console.log(`Created Token Success::`, tokens)

            return {
                code: 201,
                metadata: {
                    user: getInfoData({
                        fields: ['_id', 'name', 'email'],
                        object: newUser,
                    }),
                    tokens,
                },
            }
        }

        return {
            code: 200,
            metadata: null,
        }
    }
}

module.exports = AccessService
