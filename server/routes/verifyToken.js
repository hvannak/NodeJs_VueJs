var jwt = require('jsonwebtoken');
const Role = require('../models/Role');
const Autherize = require('../models/Autherize');
const UrlPattern = require('url-pattern');
const {logger} = require('../logger');

module.exports = async function auth (req,res,next) {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');
    try{
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        req.user = verified;
        let parent = req.originalUrl.split('/')[2];
        let authObj = await Autherize.find({
            $and:[{
                name: 'routers',
                parent: parent
            }]
        }).populate({
            path: 'Role',
            match: { users: req.user._id }
        });
        let existrouter = false;
        authObj.forEach(data => {
            data.values.forEach(element => {
                let pathget = (element.path != '/') ? '/api/' + authObj[0].parent + element.path : '/api/' + authObj[0].parent;
                var pattern = new UrlPattern(pathget);
                if(pattern.match(req.originalUrl) != null || pathget == req.originalUrl){
                    existrouter = true;
                    return existrouter;
                }       
            });
        });
        if(existrouter == false) return res.status(403).send('Unautherization Url');

        next();
    }catch(err){
        logger.error('verify token:' + err);
        res.status(400).send(err);
    }
}