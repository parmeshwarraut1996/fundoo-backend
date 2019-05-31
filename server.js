const http = require('http');
const express=require('express');
const bodyParser=require('body-parser');
const expressValidator=require('express-validator');
const mongoose = require('mongoose');
const cors=require('cors');
var config=require('./config/config.database')
var user=require('./routes/user.route');
var router=require('./routes/user.route');
var login=require('./routes/user.route')
const hostname = '127.0.0.1';
const port = 3100;
const app=express();;


app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
  extended:false
}));
app.use('/',router);

mongoose.connect(config.url, {
  useNewUrlParser: true
}).then(() => {
  console.log("Successfully connected to the database");
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});
app.listen(port, ()=>{
  console.log("server is running http://"+hostname+':'+port)

})