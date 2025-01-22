const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }, 
  
    name: {
        type: String,
        required: true
    }, 
    Files : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        }
    ]

},
 { timestamps: true });

const Folder = mongoose.model('Folder', folderSchema);
module.exports = Folder;