const express = require('express');
const router = express.Router();
const Language = require('../models/Language');
const verify = require('../routes/verifyToken');
const {updatemessage, savemessage} = require('../helper');
const {logger} = require('../logger');

router.get('/all', async (req,res) => {
    try{
        const result = await Language.find();
        res.json(result);
    }catch(err){
        logger.error('language page:' + err);
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
                docObj = await Language.find(filter).limit(pageSize).skip(pageSize*(currentPage-1)).sort({
                    [opt.sortBy[0]]: 'asc'
                });
            } else {
                console.log('desc');
                docObj = await Language.find(filter).limit(pageSize).skip(pageSize*(currentPage-1)).sort({
                    [opt.sortBy[0]]: 'desc'
                });
            }
        } else{
            docObj = await Language.find(filter).limit(pageSize).skip(pageSize*(currentPage-1)).sort({
                _id: 'asc'
            });
        }
        var totalItems = await Language.count(filter);
        res.json({objList:docObj,totalDoc:totalItems});

    }catch(err){
        logger.error('language page:' + err);
        res.json(err);
    }
});

router.get('/search/:value',verify,async (req,res) => {
    try{
        var filter = {
            title: { "$regex": req.params.value, "$options": "i" }
        };
        const docObj = await Language.find(filter);
        res.json(docObj);
    }catch(err){
        logger.error('language search:' + err);
        res.json(err)
    }
});

router.post('/post',verify,async (req,res)=> {
    const docObj = new Language({
        title: req.body.title,
        shortcode: req.body.shortcode,
        default: req.body.default
    });
    try{
        await docObj.save();
        res.json({obj:docObj,message:savemessage});
    } catch(err) {
        logger.error('language post:' + err);
        res.json(err);
    }
});

router.get('/getById/:langId',verify, async (req,res) => {
    try{
        const result = await Language.findById(req.params.langId);
        res.json(result);
    }catch(err){
        logger.error('language getById:' + err);
        res.json(err);
    }
});

router.delete('/delete/:langId',verify, async (req,res) => {
    try{
        const result = await Language.remove({_id: req.params.langId});
        res.json(result);
    }catch(err){
        logger.error('language delete:' + err);
        res.json(err)
    }
});

router.put('/put/:langId',verify, async (req,res) => {
    try{
        const filter = { _id: req.params.langId };
        const update = new Language({
            _id: req.body._id,
            title: req.body.title,
            shortcode: req.body.shortcode,
            default: req.body.default     
        });
        await Language.update(filter,update);
        res.json({obj:update,message:updatemessage});
    }catch(err){
        logger.error('category put:' + err);
        res.json(err)
    }
});

module.exports = router;