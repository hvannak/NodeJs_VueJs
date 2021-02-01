const mongoose = require('mongoose');

const languageSchema = mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    shortcode:{
        type:String,
        require:true
    },
    default: {
        type:Boolean,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Language',languageSchema);