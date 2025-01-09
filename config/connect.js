const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/Stage")
    .then(
        ()=> {
            console.log('Connected to MongoDB Atlas');
            
        }
    )
    .catch(
        (error) => {
            console.error('Failed to connect to MongoDB Atlas', error);
        }
    );

    module.exports = mongoose;