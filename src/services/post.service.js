const postModel = require('../models/postSchema.model')

class PostFactory {
    static async createPost(payload) {
        return new Post(payload).createPost()
    }
}

class Post {
    constructor({
        post_name,
        post_thumbnail,
        post_description,
        post_content,
        post_category,
        post_tags,
    }) {
        this.post_name = post_name
        this.post_thumbnail = post_thumbnail
        this.post_description = post_description
        this.post_content = post_content
        this.post_category = post_category
        this.post_tags = post_tags
    }

    async createPost() {
        return await postModel.create(this)
    }
}

module.exports = PostFactory
