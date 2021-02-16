const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const PostImage = require('../models/PostImage');
const verify = require('../routes/verifyToken');
const {updatemessage, savemessage} = require('../helper');
const {logger} = require('../logger');
var Jimp = require('jimp');

//GET BACK ALL THE POSTS
router.get('/all',verify, async (req,res) => {
    try{
        const result = await Post.find();
        res.json(result);
    }catch(err){
        logger.error('post all:' + err);
        res.json(err);
    }
});

router.post('/searchByCat',async (req,res) => {
    try{
        console.log(req.body);
        let opt = req.body.pageOpt;
        var pageSize = opt.itemsPerPage;
        var currentPage = opt.page;
        var docObj;
        var filter = (req.body.categoryId != '-1') ? {
            $and:[{categoryId: req.body.categoryId},{$or:[{title: { "$regex": req.body.searchObj, "$options": "i" }},
            {description: { "$regex": req.body.searchObj, "$options": "i" }},
            {location: { "$regex": req.body.searchObj, "$options": "i" }}] }]
        } : {
            $or:[{title: { "$regex": req.body.searchObj, "$options": "i" }},
            {description: { "$regex": req.body.searchObj, "$options": "i" }},
            {location: { "$regex": req.body.searchObj, "$options": "i" }}]
        };

        docObj = await Post.find(filter).limit(pageSize).skip(pageSize*(currentPage-1)).sort({
            date: 'desc'
        });

        var totalItems = await Post.count(filter);
        res.json({objList:docObj,totalDoc:totalItems});

    }catch(err){
        logger.error('post page:' + err);
        res.json(err);
    }
});

router.post('/page',verify,async (req,res) => {
    try{
        let opt = req.body.pageOpt;
        var pageSize = opt.itemsPerPage;
        var currentPage = opt.page;
        var docObj;
        var handlenull = (req.body.searchObj == null) ? '' : req.body.searchObj;
        var filter = (handlenull != '') ? {[req.body.searchObjby]: { "$regex": req.body.searchObj, "$options": "i" } } : {};
        if(opt.sortBy.length == 1 && opt.sortDesc.length == 1){
            if(opt.sortDesc[0] == false){
                console.log('asc');
                docObj = await Post.find(filter).limit(pageSize).skip(pageSize*(currentPage-1)).sort({
                    [opt.sortBy[0]]: 'asc'
                });
            } else {
                console.log('desc');
                docObj = await Post.find(filter).limit(pageSize).skip(pageSize*(currentPage-1)).sort({
                    [opt.sortBy[0]]: 'desc'
                });
            }
        } else{
            docObj = await Post.find(filter).limit(pageSize).skip(pageSize*(currentPage-1)).sort({
                _id: 'asc'
            });
        }
        var totalItems = await Post.count(filter);
        res.json({objList:docObj,totalDoc:totalItems});

    }catch(err){
        logger.error('post page:' + err);
        res.json(err);
    }
});

router.put('/put/:roleId',verify, async (req,res) => {
    try{
        const filter = { _id: req.params.roleId };
        const docObj = new Post({
            _id: req.body._id,
            categoryId: req.body.categoryId,
            category: req.body.category,
            title: req.body.title,
            description: req.body.description,
            phone: req.body.phone,
            email: req.body.email,
            location: req.body.location,
            image: req.body.image      
        });
        await Post.update(filter,update);
        res.json({obj:docObj,message:updatemessage});
    } catch(err) {
        logger.error('post put:' + err);
        res.json(err)
    }
});

router.post('/post',verify,async (req,res)=> {

    const postsave = new Post({
        categoryId: req.body.categoryId,
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        phone: req.body.phone,
        email: req.body.email,
        location: req.body.location
    });

    try{
        const result = await postsave.save();

        // use forof with async cannot use foreach
        for (const element of req.body.image) {
            let bufferimg = new Buffer(element.split(',')[1],'base64');
            let quality = await (await Jimp.read(bufferimg))
                                            .quality(60)
                                            .scale(16/9);
            let imgbase = await quality.getBase64Async(Jimp.MIME_PNG);
            let imagePost = new PostImage({
                image: imgbase,
                post: postsave._id
            });
            await imagePost.save()
        }

        res.send({obj:result,message:savemessage});
    } catch(err) {
        logger.error('post post:' + err);
        res.json(err);
    }
});

router.get('/getById/:postId',verify, async (req,res) => {
    try{
        const result = await Post.findById(req.params.postId);
        res.json(result);
    }catch(err){
        logger.error('post getById:' + err);
        res.json(err);
    }
});

router.delete('/delete/:postId',verify, async (req,res) => {
    try{
        const result = await Post.remove({_id: req.params.postId});
        await PostImage.remove({post: req.params.postId});
        res.json(result);
    }catch(err){
        logger.error('post delete:' + err);
        res.json(err);
    }
});

//UPDATE A POST
router.patch('/patch/:postId',verify, async (req,res) => {
    try{
        const result = await post.updateOne({_id: req.params.postId},
            {$set:{title: req.body.title}});
        res.json(result);
    }catch(err){
        res.json(err);
    }
});

module.exports = router;