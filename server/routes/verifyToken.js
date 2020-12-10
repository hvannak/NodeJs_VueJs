var jwt = require('jsonwebtoken');
const Role = require('../models/Role');
const Autherize = require('../models/Autherize');
const UrlPattern = require('url-pattern');

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
        authObj[0].values.forEach(element => {
            console.log('/api/' + authObj[0].parent + element.path);
        });
        

        next();
    }catch(err){
        res.status(400).send('Invalid Token');
    }
}