const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const {getendpoints} = require('./helper');
const verify = require('./routes/verifyToken');
//Import Models
const User = require('./models/User');
const Role = require('./models/Role');
const Post = require('./models/post');
const Autherize = require('./models/Autherize');

require('dotenv/config');
//Middleware
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
//Import Routes 
const postsRoute = require('./routes/posts');
const authRoute = require('./routes/auth');
const roleRoute = require('./routes/role');
const autherizeRoute = require('./routes/autherize');

app.use('/api/posts',postsRoute);
app.use('/api/user',authRoute);
app.use('/api/role',roleRoute);
app.use('/api/autherize',autherizeRoute);

app.get('/api/router',verify,(req,res) => {
    try {
        let postendpoints = {
            id: 1,
            name:'posts',
            children:[
                {
                    id: 1,
                    parent:'posts',
                    name:'props',
                    props: Object.keys(Post.schema.paths)
                },
                {
                    id: 2,
                    parent:'posts',
                    name:'routers',
                    routers: getendpoints(postsRoute)
                }
            ]
        };
        let authendpoints = {
            id: 2,
            name:'user',
            children:[
                {
                    id: 1,
                    parent:'user',
                    name:'props',
                    props: Object.keys(User.schema.paths)
                },
                {
                    id: 2,
                    parent:'user',
                    name:'routers',
                    routers: getendpoints(authRoute)
                }
            ]
        };
        let roleendpoints = {
            id: 3,
            name:'role',
            children:[
                {
                    id: 1,
                    parent:'role',
                    name:'props',
                    props: Object.keys(Role.schema.paths)
                },
                {
                    id: 2,
                    parent:'role',
                    name:'routers',
                    routers: getendpoints(roleRoute)
                }
            ]
        };
        let autherizeendpoints = {
            id: 4,
            name:'autherize',
            children:[
                {
                    id: 1,
                    parent:'autherize',
                    name:'props',
                    props: Object.keys(Autherize.schema.paths)
                },
                {
                    id: 2,
                    parent:'autherize',
                    name:'routers',
                    routers: getendpoints(autherizeRoute)
                }
            ]
        };
        res.send([postendpoints,authendpoints,roleendpoints,autherizeendpoints]);
    } catch (err) {
        console.log(err);
    }
});

mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser:true,useUnifiedTopology: true},()=>{
    console.log('connected to DB')
});

app.listen(3000,()=> {
    console.log("Server up and running");
});