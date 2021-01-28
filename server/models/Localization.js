const mongoose = require('mongoose');

const localizationSchema = mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    shortcode:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Localization',localizationSchema);