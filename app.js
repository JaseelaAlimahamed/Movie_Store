const express = require('express');
const app = express();
const helmet = require('helmet')
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv/config');
const logger = require('morgan');

const PORT = process.env.PORT|| 5000;




//routes
const userRoutes = require('./router/router.js');
//     
app.use('/',userRoutes)



//middlewares
app.use(logger('dev'))
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors({
    origin: 'http://localhost:3000', // allow requests from this origin
    credentials: true, // allow credentials to be sent with the request
  }))
  
  // Use Helmet!
  app.use(helmet());
  
  
  //databaseConnection
  const db=require('./config/databaseConnection.js')
  db();
  
  

//serverPort
app.listen(PORT, () =>console.log(`server started on ${PORT}`));