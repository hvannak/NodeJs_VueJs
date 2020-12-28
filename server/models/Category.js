const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    icon:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Category',categorySchema);