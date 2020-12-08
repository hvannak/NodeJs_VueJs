const router = require('express').Router();
const Autherize = require('../models/Autherize');
const verify = require('../routes/verifyToken');
const {updatemessage, savemessage} = require('../helper');

router.put('/:authId',verify, async (req,res) => {
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
        res.json(err)
    }
});

router.post('/', async (req,res) => {
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
        res.json(err)
    }
});

module.exports = router;