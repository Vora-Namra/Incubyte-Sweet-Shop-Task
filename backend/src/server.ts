const express = require('express');
const app = express();

const  connectDB = require('./config/db');

app.get('/', (req:any, res:any) => {
    connectDB();
  res.send('Hello World!');
});





app.listen(3000);