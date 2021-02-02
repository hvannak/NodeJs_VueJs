const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    lang:{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'Language' 
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