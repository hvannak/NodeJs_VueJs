const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const verify = require('../routes/verifyToken');
const {updatemessage, savemessage} = require('../helper');
const {logger} = require('../logger');

router.get('/all',verify, async (req,res) => {
    try{
        const result = await Category.find();
        res.json(result);
    }catch(err){
        logger.error('category page:' + err);
        res.json({message: err})
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
                docObj = await Category.find(filter).limit(pageSize).skip(pageSize*(currentPage-1)).sort({
                    [opt.sortBy[0]]: 'asc'
                });
            } else {
                console.log('desc');
                docObj = await Category.find(filter).limit(pageSize).skip(pageSize*(currentPage-1)).sort({
                    [opt.sortBy[0]]: 'desc'
                });
            }
        } else{
            docObj = await Category.find(filter).limit(pageSize).skip(pageSize*(currentPage-1)).sort({
                _id: 'asc'
            });
        }
        console.log(docObj);
        var totalItems = await Category.count(filter);
        res.json({objList:docObj,totalDoc:totalItems});

    }catch(err){
        logger.error('category page:' + err);
        res.json(err);
    }
});

router.get('/search/:value',verify,async (req,res) => {
    try{
        var filter = {
            title: { "$regex": req.params.value, "$options": "i" }
        };
        const docObj = await Category.find(filter);
        res.json(docObj);
    }catch(err){
        logger.error('category search:' + err);
        res.json(err)
    }
});

router.post('/post',verify,async (req,res)=> {
    const docObj = new Category({
        title: req.body.title,
        icon: req.body.icon
    });
    try{
        const savestate = await docObj.save();
        res.json({obj:docObj,message:savemessage});
    } catch(err) {
        logger.error('category post:' + err);
        res.json(err);
    }
});

router.get('/getById/:catId',verify, async (req,res) => {
    try{
        const result = await Category.findById(req.params.catId);
        res.json(result);
    }catch(err){
        logger.error('category getById:' + err);
        res.json(err);
    }
});

router.delete('/delete/:catId',verify, async (req,res) => {
    try{
        const result = await Category.remove({_id: req.params.catId});
        res.json(result);
    }catch(err){
        logger.error('category delete:' + err);
        res.json(err)
    }
});

router.put('/put/:catId',verify, async (req,res) => {
    try{
        const filter = { _id: req.params.catId };
        const update = new Category({
            _id: req.body._id,
            title: req.body.title,
            icon: req.body.icon     
        });
        await Category.update(filter,update);
        res.json({obj:update,message:updatemessage});
    }catch(err){
        logger.error('category put:' + err);
        res.json(err)
    }
});

module.exports = router;