const router = require('express').Router();
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const verify = require('../routes/verifyToken');
const {updatemessage, savemessage} = require('../helper');

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
        res.json(err);
    }
});

router.post('/', async (req,res) => {
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
        res.status(400).send(err);
    }
});

router.delete('/:roleId',verify, async (req,res) => {
    try{
        const docObj = await Role.remove({_id: req.params.roleId});
        res.json(docObj);
    }catch(err){
        res.json(err)
    }
});

module.exports = router;