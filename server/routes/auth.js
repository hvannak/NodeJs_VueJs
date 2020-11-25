const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const verify = require('../routes/verifyToken');
const {registerValidation,loginValidation} = require('../validation');
const {updatemessage, savemessage} = require('../helper');

router.post('/register', async (req,res) => {
    //LETS VALIDATE THE DATA BEFORE WE A USER
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //Checking if the user is already exist
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exist');
    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);


    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,      
    });
    try{
        const saveUser = await user.save();
        res.send({_id:user._id,message:'You register successfully'});
    }catch(err){
        res.status(400).send(err);
    }
});

router.post('/login', async (req,res) => {
    console.log(req.body);
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email or password is wrong');
    const validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send('Invalid password');
    //Create and assign a token
    const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);
    // res.headers("authorization", `Bearer ${token}`).send();
});

router.get('/:userId',verify,async (req,res) => {
    try{
        const docObj = await User.findById(req.params.userId);
        res.json(docObj);
    }catch(err){
        res.json(err)
    }
});

router.get('/',verify,async (req,res) => {
    try{
        const docObj = await User.find();
        res.json(docObj);
    }catch(err){
        console.log(err);
        res.json(err);
    }
});

router.put('/:userId',verify, async (req,res) => {
    //Checking if the user is already exist
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exist');
    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);
    try{
        const filter = { _id: req.params.userId };
        const update = { 
            name: req.body.name,
            email:req.body.email,
            password: hashPassword         
        };
        let docObj = await User.findOneAndUpdate(filter, update, {
            new: true
          });
        res.json({obj:docObj,message:updatemessage});
    } catch(err) {
        res.json(err)
    }
});

router.post('/', async (req,res) => {
    //LETS VALIDATE THE DATA BEFORE WE A USER
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    //Checking if the user is already exist
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exist');
    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);


    const docObj = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,      
    });
    try{
        const saveUser = await docObj.save();
        res.send({obj:docObj,message:savemessage});
    }catch(err){
        res.status(400).send(err);
    }
});

router.delete('/:userId',verify, async (req,res) => {
    try{
        const docObj = await User.remove({_id: req.params.userId});
        console.log(docObj);
        res.json(docObj);
    }catch(err){
        res.json(err)
    }
});

module.exports = router;