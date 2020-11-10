const express = require('express');
const router = express.Router();
const post = require('../models/post');

router.get('/',(req,res) => {
    res.send('We are on post');
});

router.post('/',(req,res)=> {
    const postsave = new post({
        title: req.body.title,
        description:req.body.description
    });
    postsave.save().then(data => {
        res.json(data);
    }).catch(err => {
        res.json({message: err});
    });
});

module.exports = router;