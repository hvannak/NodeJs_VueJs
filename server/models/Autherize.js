const mongoose = require('mongoose');
const routerSchema = new mongoose.Schema({ 
    method: {
      type:String,
      require:true
    }, 
    path: {
        type:String,
        require:true
    }
});

const autherizeSchema = mongoose.Schema({
    role:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],  
    props:[String],
    router:[routerSchema],
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Autherize',autherizeSchema);