const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { post } = require('./routes/posts');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');
//Middleware
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
//Import Routes
const postsRoute = require('./routes/posts');
const authRoute = require('./routes/auth');
const roleRoute = require('./routes/role');

app.use('/api/posts',postsRoute);
app.use('/api/user',authRoute);
app.use('/api/role',roleRoute);

app.get('/',(req,res) => {
    res.json({
        success: 1,
        message: "This is rest api working"
    });
});

mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser:true,useUnifiedTopology: true},()=>{
    console.log('connected to DB')
});

app.listen(3000,()=> {
    console.log("Server up and running");
});