var jwt = require('jsonwebtoken');
const Role = require('../models/Role');
const Autherize = require('../models/Autherize');

module.exports = async function auth (req,res,next) {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');
    try{
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        req.user = verified;
        console.log(req.originalUrl);
        let url = req.originalUrl;
        // let authObj = await Autherize.find({
        //     parent: 'user',
        //     name: 'router'
        // }).populate({
        //     path: 'Role',
        //     match: { users: req.user._id },
        //     select: 'name'
        // });
        // console.log(authObj);
        next();
    }catch(err){
        res.status(400).send('Invalid Token');
    }
}