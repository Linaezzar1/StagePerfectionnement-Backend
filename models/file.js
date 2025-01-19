const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }, 
    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }, 
    name: {
        type: String,
        required: true
    }, 
    content: {
        type: String,
        default: ''
    }
    
},
 { timestamps: true });

const File = mongoose.model('File', fileSchema);
module.exports = File;

