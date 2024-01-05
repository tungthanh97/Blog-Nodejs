'use strict'

const { Schema, model } = require('mongoose') // Erase if already required
const DOCUMENT_NAME = 'Post'
const COLLECTION_NAME = 'Posts'

const postSchema = new Schema(
    {
        post_name: { type: String, required: true },
        post_thumbnail: { type: String, required: true },
        post_description: { type: String, required: true },
        post_content: { type: String, required: true },
        post_category: { type: String, required: true },
        post_tags: { type: Array, required: true },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
)

//Export the model
module.exports = model(DOCUMENT_NAME, postSchema)
