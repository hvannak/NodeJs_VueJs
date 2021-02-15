const mongoose = require('mongoose');
const postImageSchema = mongoose.Schema({
    image:{
        type: Buffer,
        require: true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Post'
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('PostImage',postImageSchema);