const router = require('express').Router();
const User = require('../models/User');
const verify = require('../routes/verifyToken');
const {updatemessage, savemessage} = require('../helper');

router.get('/endpoints',verify,async (req,res) => {
    try{
        // const postendpoints = postsRoute.stack.filter(x=> x.route && x.route.path && Object.keys(x.route.methods) != 0)
        // .map(layer => ({ method :layer.route.stack[0].method.toUpperCase(), path: layer.route.path}));
        // let endpoints = {
        //     name: "Post",
        //     router: postendpoints
        // }
        // res.json(endpoints);
    }catch(err){
        console.log(err);
        res.json(err);
    }
});

module.exports = router;