const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    image:{
        type: Buffer,
        require: true
    }
})

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
    image:[imageSchema],
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Post',postSchema);