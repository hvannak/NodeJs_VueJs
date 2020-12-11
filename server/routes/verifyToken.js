var jwt = require('jsonwebtoken');
const Role = require('../models/Role');
const Autherize = require('../models/Autherize');
const UrlPattern = require('url-pattern');
const e = require('express');

module.exports = async function auth (req,res,next) {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');
    try{
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        req.user = verified;
        // console.log(req.method);
        // console.log(req.originalUrl);
        // console.log(req.baseUrl);
        // console.log(req.url);
        // let url = req.originalUrl;
        let authObj = await Autherize.find({
            $and:[{
                name: 'routers',
                parent: 'user'
            }]
        }).populate({
            path: 'Role',
            match: { users: req.user._id }
        });
        // console.log(authObj);
        // console.log(pattern.match(req.originalUrl));
        let existrouter = false;
        authObj[0].values.forEach(element => {
            // console.log('/api/' + authObj[0].parent + element.path);
            let pathget = '/api/' + authObj[0].parent + element.path;
            var pattern = new UrlPattern(pathget);
            console.log(pattern.match(req.originalUrl));
            if(pattern.match(req.originalUrl) !== null){
                existrouter = true;
                throw e;
            }
            
        });
        // var pattern = new UrlPattern('/api/user/search/:value');
        // console.log(req.originalUrl);
        // console.log(pattern.match(req.originalUrl));
        

        next();
    }catch(err){
        res.status(400).send('Invalid Token');
    }
}