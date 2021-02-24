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
        lang: req.body.lang,
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

router.post('/getByLocal',verify, async (req,res) => {
    try{
        var filter = {
            $and:[{
                parent: req.body.parent
            },
            {
                props: req.body.props
            },{
                lang: req.body.lang
            }]
        };
        const result = await Localization.find(filter);
        res.json(result);
    }catch(err){
        logger.error('localization getByParent:' + err);
        res.json(err);
    }
});

router.get('/getByConstant',verify, async (req,res) => {
    try{
        let homeCost = {
            id: 1,
            name:'home',
            children:[
                {
                    id: 1,
                    parent:'home',
                    name:'props',
                    props: ['All','Looking','Post_free','Login','Register','Welcome','Searchdata','Message_title',
                    'Message_post','Message_looking','Close','ManageProfile','Logout','Username','Useremail','Password','ConfirmPassword',
                    'Save']
                }
            ]
        };
        let searchCost = {
            id: 2,
            name:'search',
            children:[
                {
                    id: 1,
                    parent:'search',
                    name:'props',
                    props: ['Message_title_detail','Close']
                }
            ]
        };
        let postCost = {
            id: 3,
            name:'post',
            children:[
                {
                    id: 1,
                    parent:'post',
                    name:'props',
                    props: ['SelectCategory','InputInformation','Category','Title','Description','Phone','Email','Location','Fileinput','Post',
                    'Message_post_success','Contact','Address']
                }
            ]
        };
        let clientLoginCost = {
            id: 4,
            name:'clientlogin',
            children:[
                {
                    id: 1,
                    parent:'clientlogin',
                    name:'props',
                    props: ['CEmail','CPassword','BtnLogin']
                }
            ]
        };
        let clientRegisterCost = {
            id: 5,
            name:'clientregister',
            children:[
                {
                    id: 1,
                    parent:'clientregister',
                    name:'props',
                    props: ['RUsername','REmail','RPassword','RConfirmPassword','BtnRegister']
                }
            ]
        };
        let validationCost = {
            id: 6,
            name:'validation',
            children:[
                {
                    id: 1,
                    parent:'validation',
                    name:'props',
                    props: ['VRequire','VEmail','VMin','VMax','VNumeric','VDouble']
                }
            ]
        };
        res.json([homeCost,searchCost,postCost,clientLoginCost,clientRegisterCost,validationCost]);
    }catch(err){
        logger.error('localization getByParent:' + err);
        res.json(err);
    }
});

router.get('/getByLang/:langId', async (req,res) => {
    try{
        var filter = {
            lang: req.params.langId
        };
        const result = await Localization.find(filter);
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