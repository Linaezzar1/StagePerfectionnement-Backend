const express = require('express');
const userApi = require('./routes/users');

const cors = require('cors');
require('./config/connect');

const app = express();
app.use(express.json());


app.use(cors());



app.use('/user' , userApi);

app.use('/uploads' , express.static('uploads'));


app.listen(3000 , () => {console.log('server works!');}
)