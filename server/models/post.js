const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    categoryId:{
        type:String,
        require: true
    },
    category:{
        type:String,
        require: true
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
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Post',postSchema);