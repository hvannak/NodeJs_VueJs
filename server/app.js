const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const {getendpoints} = require('./helper');
const verify = require('./routes/verifyToken');
const bcrypt = require('bcryptjs');
//Import Models
const User = require('./models/User');
const Role = require('./models/Role');
const Post = require('./models/Post');
const Autherize = require('./models/Autherize');
const Category = require('./models/Category');

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
const categoryRoute = require('./routes/category');

app.use('/api/posts',postsRoute);
app.use('/api/user',authRoute);
app.use('/api/role',roleRoute);
app.use('/api/autherize',autherizeRoute);
app.use('/api/category',categoryRoute);

app.get('/api/router',verify,(req,res) => {
    try {
        let routerendpoints = {
            id: 1,
            name:'router',
            children:[
                {
                    id: 1,
                    parent:'router',
                    name:'props',
                    props: []
                },
                {
                    id: 2,
                    parent:'router',
                    name:'routers',
                    routers: [
                        {
                            method: 'GET',
                            path: '/'
                        }
                    ]
                }
            ]
        };
        let postendpoints = {
            id: 2,
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
            id: 3,
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
            id: 4,
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
            id: 5,
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
        let categoryendpoints = {
            id: 6,
            name:'category',
            children:[
                {
                    id: 1,
                    parent:'category',
                    name:'props',
                    props: Object.keys(Category.schema.paths)
                },
                {
                    id: 2,
                    parent:'category',
                    name:'routers',
                    routers: getendpoints(categoryRoute)
                }
            ]
        };
        res.send([routerendpoints,postendpoints,authendpoints,roleendpoints,autherizeendpoints,categoryendpoints]);
    } catch (err) {
        console.log(err);
    }
});

mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser:true,useUnifiedTopology: true},async ()=> {
    console.log('connected to DB');
    //create user role and autherize when initialize
    const userDoc = await User.countDocuments();
    if(!userDoc){
        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash('123456',salt);
        const user = new User({
            name: 'admin',
            email: 'vannak2010@gmail.com',
            password: hashPassword,      
        });
        await user.save();
        const roleDoc = await Role.countDocuments();
        if(!roleDoc){
            const role = new Role({
                name: 'admin',
                users: [user._id]     
            });
            await role.save();
            console.log(role._id);
            const authDoc = await Autherize.countDocuments();
            if(!authDoc){
                const docObj1 = [new Autherize({
                    role: role._id,
                    parent: 'user',
                    name: 'routers',
                    values: [
                        {
                            method: 'POST',
                            path: '/register'
                        },
                        {
                            method: 'PUT',
                            path: '/put/:userId'
                        },
                        {
                            method: 'DELETE',
                            path: '/delete/:userId'
                        },
                        {
                            method: 'POST',
                            path: '/login'
                        },
                        {
                            method: 'GET',
                            path: '/getById/:userId'
                        },
                        {
                            method: 'GET',
                            path: '/all'
                        },
                        {
                            method: 'POST',
                            path: '/page'
                        },
                        {
                            method: 'GET',
                            path: '/search/:value'
                        }
                    ]     
                }),
                new Autherize({
                    role: role._id,
                    parent: 'role',
                    name: 'routers',
                    values: [
                        {
                            method: 'POST',
                            path: '/post'
                        },
                        {
                            method: 'PUT',
                            path: '/put/:roleId'
                        },
                        {
                            method: 'DELETE',
                            path: '/delete/:roleId'
                        },
                        {
                            method: 'GET',
                            path: '/getById/:roleId'
                        },
                        {
                            method: 'POST',
                            path: '/page'
                        },
                        {
                            method: 'GET',
                            path: '/search/:value'
                        }
                    ]
                }),
                new Autherize({
                    role: role._id,
                    parent: 'autherize',
                    name: 'routers',
                    values: [
                        {
                            method: 'POST',
                            path: '/post'
                        },
                        {
                            method: 'PUT',
                            path: '/put/:authId'
                        },
                        {
                            method: 'GET',
                            path: '/search/:roleId'
                        }
                    ]
                }),
                new Autherize({
                    role: role._id,
                    parent: 'router',
                    name: 'routers',
                    values: [
                        {
                            method: 'GET',
                            path: '/'
                        }
                    ]
                })];
                let result = await Autherize.collection.insertMany(docObj1);
                console.log(result);            
            }
        }
    }
});

app.listen(3000,()=> {
    console.log("Server up and running");
});