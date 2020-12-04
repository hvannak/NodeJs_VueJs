const mongoose = require('mongoose');
const routerSchema = new mongoose.Schema({ 
    routes:[{
        method: {
        type:String,
        require:true
        }, 
        path: {
            type:String,
            require:true
        }
    }]
});

const propsSchema = new mongoose.Schema({
    props:[String]
})

const autherizeSchema = mongoose.Schema({
    role:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],  
    props:[propsSchema],
    router:[routerSchema],
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Autherize',autherizeSchema);