const router = require('express').Router();
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const verify = require('../routes/verifyToken');
const {updatemessage, savemessage} = require('../helper');
const {logger} = require('../logger');

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
                docObj = await Role.find(filter).populate("users").limit(pageSize).skip(pageSize*(currentPage-1)).sort({
                    [opt.sortBy[0]]: 'asc'
                });
            } else {
                console.log('desc');
                docObj = await Role.find(filter).populate("users").limit(pageSize).skip(pageSize*(currentPage-1)).sort({
                    [opt.sortBy[0]]: 'desc'
                });
            }
        } else{
            docObj = await Role.find(filter).populate("users").limit(pageSize).skip(pageSize*(currentPage-1)).sort({
                _id: 'asc'
            });
        }
        var totalItems = await Role.count(filter);
        res.json({objList:docObj,totalDoc:totalItems});

    }catch(err){
        logger.error('role page:' + err);
        res.json(err);
    }
});

router.get('/search/:value',verify,async (req,res) => {
    try{
        var filter = {
            name: { "$regex": req.params.value, "$options": "i" }
        };
        const docObj = await Role.find(filter);
        res.json(docObj);
    }catch(err){
        logger.error('role search:' + err);
        res.json(err)
    }
});

router.put('/put/:roleId',verify, async (req,res) => {
    //Checking if the user is already exist
    const nameExist = await Role.findOne({name: req.body.name});
    if(nameExist !=null && req.params.roleId != nameExist._id) return res.status(400).send('Name already exist');
    try{
        const filter = { _id: req.params.roleId };
        const update = new Role({
            _id: req.body._id,
            name: req.body.name,
            users: req.body.users      
        });
        await Role.update(filter,update);
        let docObj = await Role.findById(req.body._id).populate("users");
        res.json({obj:docObj,message:updatemessage});
    } catch(err) {
        logger.error('role put:' + err);
        res.json(err)
    }
});

router.post('/post', async (req,res) => {
    const nameExist = await Role.findOne({name: req.body.name});
    if(nameExist) return res.status(400).send('Name already exist');
    const docObj = new Role({
        name: req.body.name,
        users: req.body.users      
    });
    try{
        await docObj.save();
        const saveUser =  await Role.findById(docObj._id).populate("users");
        res.send({obj:saveUser,message:savemessage});
    }catch(err){
        logger.error('role post:' + err);
        res.status(400).send(err);
    }
});

router.delete('/delete/:roleId',verify, async (req,res) => {
    try{
        const docObj = await Role.remove({_id: req.params.roleId});
        res.json(docObj);
    }catch(err){
        logger.error('role delete:' + err);
        res.json(err)
    }
});

module.exports = router;