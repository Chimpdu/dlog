const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let blogSchema = new Schema({
    title: { type: String },
    body: { type: String },
    author: { type: String },
    likes: { type: Number }
});

module.exports = mongoose.model("blog", blogSchema);