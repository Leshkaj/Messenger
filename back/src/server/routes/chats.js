const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Models
const Chat = require('../../models/chat');
const User = require('../../models/user');

// isAuth
const auth = require('../../middleware/auth');

router.get('/', async (req, res) => {
  const { id } = req.query;
  console.log(id);
  try {
    const chat = await Chat.findOne({ _id: id });
    const { messages } = chat;
    res.status(200).json({ messages, chat: chat._id });
  } catch (err) {
    res.status(404).send('Not found!');
  }
})

router.post('/', async (req, res) => {
  const { fullName, login, number, isAuth } = req.body;
  const userId = jwt.decode(isAuth)._id;
  const currentUser = await User.findOne({ _id: userId });
  const newContact = await User.findOne({ login });
  console.log('newContact', newContact);
  const checkChat = await Chat.findOne({ members: [currentUser._id, newContact._id] })
  const checkChatReverse = await Chat.findOne({ members: [newContact._id, currentUser._id] })
  try {
    if ((checkChat === null) && (checkChatReverse === null)) {
      const chat = new Chat({
        members: [userId, newContact._id]
      })
      await chat.save()
      currentUser.friends.push({
        fullName,
        friendId: newContact._id,
        chat: chat._id
      })
      await currentUser.save()
      newContact.friends.push({
        fullName: currentUser.fullName,
        friendId: currentUser._id,
        chat: chat._id
      })
      try {
        newContact.save()
      } catch (err) {
        console.log(err);
      }
      console.log('full completed')
      res.status(201).json({ chatId: chat._id });
    } else {
      const error = 'This user is already your friend!'
      res.json(error);
      return res.end();
    }

  } catch (e) {
    console.log('error');
    if (checkChat === null && checkChatReverse === null) {
      const error = 'User does not exist!'
      res.status(404).send(error);
    } else {
      const error = 'This user is already your friend!'
      res.status(404).send(error);
    }
  }
})

router.get('/conversations', async (req, res) => {
  const { isAuth } = req.query;
  try {
    const userId = jwt.decode(isAuth)._id;
    const { fullName } = await User.findOne({ _id: userId });
    let chats = await Chat.find({ members: userId }).populate("members");

    chats = chats.map(chat => chat.toObject());
    chats = chats.map(chat => {
      return {
        _id: chat._id,
        members: chat.members.map(member => {
          return {
            name: member.fullName,
            avatar: member.avatar
          }
        }).filter(member => member.name !== fullName),
        messages: chat.messages
      }
    })
    res.status(200).json(chats);
  } catch (error) {
    res.status(404).send(error);
  }
})


router.post('/seen', async (req, res) => {
  const { chat, isAuth } = req.body;  
  try {
    const userId = jwt.decode(isAuth)._id;    
    const { login } = await User.findOne({ _id: userId });
    
    let currentChat = await Chat.findOne({ _id: chat });

    let { messages } = currentChat;

    messages = messages.map(message => message.toObject()).map(message => {
      if (message.owner !== login) {
        return { ...message, isSeen: true }
      } else {
        return message
      }
    })
    currentChat.messages = messages;
    await currentChat.save();
    res.status(200).json(true);
  } catch (err) {
    res.status(404).send(err);
  }
})


module.exports = router;
``
