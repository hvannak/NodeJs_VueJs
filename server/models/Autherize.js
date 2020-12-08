const mongoose = require('mongoose');

const autherizeSchema = mongoose.Schema({
    role:{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' },  
    parent:{
        type:String
    },
    name:{
        type:String
    },
    values:[],
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Autherize',autherizeSchema);