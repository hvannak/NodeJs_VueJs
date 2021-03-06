const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    category:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Category'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    location:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    currency:{
        type:String,
        require:true
    },
    firstimage: {
        type:String,
        require:false
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Post',postSchema);