const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();
const Chat = require('../models/chat')

const PORT = process.env.PORT || 5000;

// DB conncetion
const DB = require('../DB/dbConnection');
DB()
  .then(() => console.log('DB connected'))
  .catch(() => console.error('Errors'));

// Routs dir
const rout = require('./routes/rout');
const usersRouter = require('./routes/users');
const chatsRouter = require('./routes/chats');

// Server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Actions
const {
  DISCONNECT,
  CONNECTION,
  JOIN,
  MESSAGE,
  SEND_MESSAGE
} = require('../actions/io-actions');

// Sockets
io.on(CONNECTION, (socket) => {
  console.log('Connection on socket is started!!!');
  socket.on(JOIN, ({ user, chat }, callback) => {
    console.log(user);
    console.log('>>>>>>>>>', chat);
    socket.on(MESSAGE + chat, async ({ message }, callback) => {
      if (!message.owner || !message.content) return
      console.log(message)
      const currentChat = await Chat.findOne({ _id: chat })
      currentChat.messages.push({
        ...message
      });
      await currentChat.save();
      io.emit(SEND_MESSAGE + chat, { message })
    });
  });

  socket.on(DISCONNECT, () => {
    console.log('User has disconnected!!!');
  });
});


// Routs
app.use(rout);
app.use('/users', usersRouter);
app.use('/chats', chatsRouter);

server.listen(PORT, () => console.log(`Server has started on ${PORT}`));


