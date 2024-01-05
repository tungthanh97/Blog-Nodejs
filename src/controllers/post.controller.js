'use strict'

const Post = require('../services/post.service')

const { SuccessResponse } = require('../core/success.response')

class PostController {
    createPost = async (req, res) => {
        new SuccessResponse({
            message: 'Create new Product success',
            metadata: await Post.createPost(req.body),
        }).send(res)
    }
}

module.exports = new PostController()
