const { mongoose } = require('mongoose');

const codeSchema = new mongoose.Schema({
    code: String,
    category: String,
    data: String,
    usedBy: {
        type: String,
        default: 'Nobody'
    }
});

module.exports = { codeSchema };