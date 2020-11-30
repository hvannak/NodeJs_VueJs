const mongoose = require('mongoose');

const rolesSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        min: 6,
        max: 255
    },
    userid: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Role', rolesSchema);