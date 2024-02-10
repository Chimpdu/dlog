var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Blog = require('../models/Blog')
router.get("/blogs", async (req, res, next)=>{
    try {
        const found = await Blog.find();
        if (found.length > 0) {
            res.send(found);
        } else return res.json({"failed": "no blog found"});
    } catch (error) {
        next(error);
    }
});
router.post("/addblog", async (req, res, next)=>{
    try {
        const postedBlog = req.body;
        const newBlog = new Blog(
            {
                title: postedBlog.title,
                body: postedBlog.body,
                author: postedBlog.author,
                likes: postedBlog.likes
            }
        )
        const saved = await newBlog.save();
        return res.json({"success": "new blog added"});
    } catch (error) {
        next(error);
    }
});
router.delete("/deleteblog/:id", async (req, res, next) => {
    const id = req.params.id; 
    try {
        const removed = await Blog.deleteOne({_id: id});
        if (removed.deletedCount === 0) {
            return res.status(404).json({"error": "Blog not found"});
        }
        return res.json({"success": "Blog deleted"});
    } catch (error) {
        next(error)
    }
})
router.patch('/updatelike/:id', async (req, res, next) => {
    const { id } = req.params;
  
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(id, {
        $inc: { likes: 1 } // Increment 'likes' by 1
      }, { new: true });
  
  
      res.json({"success": "likes updated"});
    } catch (error) {
      next(error)
    }
  });
;


module.exports = router;
