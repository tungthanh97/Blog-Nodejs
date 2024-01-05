'use strict'

const express = require('express')
const postController = require('../../controllers/post.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

// check authentication middleware before next routes
router.use(authentication)

router.post('', asyncHandler(postController.createPost))

module.exports = router
