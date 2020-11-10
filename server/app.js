const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { post } = require('./routes/posts');
const bodyParser = require('body-parser');
require('dotenv/config');

app.use(bodyParser.json());
//Import Routes
const postsRoute = require('./routes/posts');

app.use('/posts',postsRoute);

app.get('/',(req,res) => {
    res.json({
        success: 1,
        message: "This is rest api working"
    });
});

mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser:true},()=>{
    console.log('connected to DB')
});

app.listen(3000,()=> {
    console.log("Server up and running");
});