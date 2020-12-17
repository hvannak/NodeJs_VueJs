const express = require('express');
const router = express.Router();
const post = require('../models/post');
const verify = require('../routes/verifyToken');

//GET BACK ALL THE POSTS
router.get('/all',verify, async (req,res) => {
    try{
        const result = await post.find();
        res.json(result);
    }catch(err){
        res.json({message: err})
    }
});

//SUBMITS A POST
router.post('/post',verify,async (req,res)=> {
    const postsave = new post({
        title: req.body.title,
        description:req.body.description
    });
    try{
        const result = await postsave.save();
        res.json(result);
    } catch(err) {
        res.json({message: err})
    }
});

router.get('/getById/:postId',verify, async (req,res) => {
    try{
        const result = await post.findById(req.params.postId);
        res.json(result);
    }catch(err){
        res.json({message: err})
    }
});

router.delete('/delete/:postId',verify, async (req,res) => {
    try{
        const result = await post.remove({_id: req.params.postId});
        res.json(result);
    }catch(err){
        res.json({message: err})
    }
});

//UPDATE A POST
router.patch('/patch/:postId',verify, async (req,res) => {
    try{
        const result = await post.updateOne({_id: req.params.postId},
            {$set:{title: req.body.title}});
        res.json(result);
    }catch(err){
        res.json({message: err})
    }
});

module.exports = router;