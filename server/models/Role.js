const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({ _id: 'string' });

const rolesSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        min: 6,
        max: 255
    },
    user: [childSchema],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Role', rolesSchema);