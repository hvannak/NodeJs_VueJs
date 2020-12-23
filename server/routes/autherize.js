const router = require('express').Router();
const Autherize = require('../models/Autherize');
const verify = require('../routes/verifyToken');
const {updatemessage, savemessage} = require('../helper');
const {logger} = require('../logger');

router.put('/put/:authId',verify, async (req,res) => {
    try{
        const filter = { _id: req.params.authId };
        const update = new Autherize({
            _id: req.body._id,
            role: req.body.role,
            parent: req.body.parent,
            name: req.body.name,
            values: req.body.values       
        });
        await Autherize.update(filter,update);
        let docObj = await Autherize.findById(req.body._id);
        res.json({obj:docObj,message:updatemessage});
    } catch(err) {
        logger.error('autherize put:' + err);
        res.json(err)
    }
});

router.post('/post',verify, async (req,res) => {
    const docObj = new Autherize({
        role: req.body.role,
        parent: req.body.parent,
        name: req.body.name,
        values: req.body.values      
    });
    try{
        await docObj.save();
        res.send({obj:docObj,message:savemessage});
    }catch(err){
        logger.error('autherize post:' + err);
        res.status(400).send(err);
    }
});

router.get('/search/:roleId',verify,async (req,res) => {
    try{
        var filter = {
            role: req.params.roleId
        };
        const docObj = await Autherize.find(filter);
        res.json(docObj);
    }catch(err){
        logger.error('autherize search roleId:' + err);
        res.json(err)
    }
});

module.exports = router;