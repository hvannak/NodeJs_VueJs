const express = require('express');
const router = express.Router();
const Localization = require('../models/Localization');
const verify = require('../routes/verifyToken');
const {updatemessage, savemessage} = require('../helper');
const {logger} = require('../logger');

router.post('/post',verify,async (req,res)=> {
    const docObj = new Localization({
        parent: req.body.parent,
        props: req.body.props,
        lang: req.body.langId,
        text: req.body.text
    });
    try{
        await docObj.save();
        res.json({obj:docObj,message:savemessage});
    } catch(err) {
        logger.error('localization post:' + err);
        res.json(err);
    }
});

router.get('/getByParent/:parent',verify, async (req,res) => {
    try{
        const result = await Localization.findById(req.params.parent);
        res.json(result);
    }catch(err){
        logger.error('localization getByParent:' + err);
        res.json(err);
    }
});


router.put('/put/:langId',verify, async (req,res) => {
    try{
        const filter = { _id: req.params.langId };
        const update = new Localization({
            _id: req.body._id,
            parent: req.body.parent,
            props: req.body.props,
            lang: req.body.langId,
            text: req.body.text    
        });
        await Localization.update(filter,update);
        res.json({obj:update,message:updatemessage});
    }catch(err){
        logger.error('localization put:' + err);
        res.json(err)
    }
});

module.exports = router;