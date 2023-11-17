'use strict'

const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const KeyTokenService = require('../services/keyToken.service')

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days',
        })
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        })

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error('error verify', err)
            } else {
                console.log('decode verify', decode)
            }
        })
        return { accessToken, refreshToken }
    } catch (error) {
        console.error('create token error', error)
    }
}

// check authen middleware
const authentication = asyncHandler(async (req, res, next) => {
    /**
     * 1 - Check userId missing
     * 2- Get accessToken
     * 3- Veriy token
     * 4- Check user in dbs
     * 5- Check keyStore with userId
     * 6- OK all => return next
     */

    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid Request')

    // 2
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid Request')

    // 3
    const keyStore = await KeyTokenService.findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not found keyStore')

    //4
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
    if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid User')
    req.keyStore = keyStore
    return next()
})

module.exports = {
    createTokenPair,
    authentication,
}
