const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const socket = require('./services/threadDb/socket-io');
const email = require('./services/email/sgEmail');
const dbRoute = require('./services/threadDb/routes')

const app = express()
app.use(cors())
app.use(express.json());
dotenv.config()
const PORT = process.env.PORT || 3001;

const http = require('http').createServer(app);

const io = require('socket.io')(http,{
  cors: {
    origin: '*',
  }
});

email(app)
socket(io)
dbRoute(app)

http.listen('3001', ()=>{
  console.log("Listening on port:", PORT)
});
