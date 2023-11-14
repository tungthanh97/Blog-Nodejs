'use strict'

const AccessService = require('../services/access.service')

const { CREATED } = require('../core/success.response')

class AccessController {
    signUp = async (req, res) => {
        new CREATED({
            message: 'Registered!',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10,
            },
        }).send(res)
    }
}

module.exports = new AccessController()
