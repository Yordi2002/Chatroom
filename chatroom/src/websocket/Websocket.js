const express = require("express");
const exp = express();
const http = require("http");
const socket = require("socket.io");
const cors = require("cors");
const io  = require("socket.io-client");

exp.use(cors())

const server = http.createServer(exp);

const socketIo = socket(server ,{
    cors: {
      origin: 'http://localhost:3001',
}});

exp.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/pages/chat.jsx');
  });

socketIo.on("connection", socket => {
    console.log("Online!");
    socket.on('message', ({ name, message }) => {
        socketIo.emit('message', { name, message })
      })
    
    socket.on('disconnect', () => {
        console.log('Offline!');
      });
})

server.listen(5500, () => console.log("server is online!"))