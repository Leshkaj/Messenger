import React, { useEffect, useRef } from 'react';
import shave from 'shave';
import { connect } from 'react-redux';
import { startChatReq } from '../../redux/actions/actions'

import './ConversationListItemBlack.css';

const ConversationListItem = (props) => {
  useEffect(() => {
    shave('.conversation-snippet', 20);
  })

  const chatItem = useRef(null);
  const { startChatReq, currentChat, isAuth } = props;
  const photos = ['https://firebasestorage.googleapis.com/v0/b/vue-elbrus-crm.appspot.com/o/avatar%2FFox-shutterstock-1186951450-rgb_vkie6v.jpg?alt=media&token=98432434-fa5d-44b3-97b6-913a15d59676', 'https://firebasestorage.googleapis.com/v0/b/vue-elbrus-crm.appspot.com/o/avatar%2FFox-shutterstock-1186951450-rgb_vkie6v.jpg?alt=media&token=98432434-fa5d-44b3-97b6-913a15d59676']
  const randomPhoto = photos[Math.floor((Math.random * 4 + 3))];
  const { _id, members, messages } = props.chat;

  const chat = _id;

  const startChat = () => {
    startChatReq(chat, isAuth);
  }

  useEffect(() => {
    if (_id === currentChat) {
      chatItem.current.className = 'conversation-list-item active-item';
    } else {
      chatItem.current.className = 'conversation-list-item';
    }
  }, [currentChat])

  return (
    <div ref={chatItem} onClick={startChat}>
      <img className="conversation-photo" src='https://firebasestorage.googleapis.com/v0/b/vue-elbrus-crm.appspot.com/o/avatar%2Fpetr.jpg?alt=media&token=2b1660a7-5133-411f-9da1-7012eeb2cecf' alt="conversation" />
      <div className="conversation-info">
        <h1 className="conversation-title">{members}</h1>
        {
          messages.length &&
          <p className="conversation-snippet">{
            messages[messages.length - 1].messageType === 'Audio' ? 'Audio message' :
              messages[messages.length - 1].messageType === 'String' ?
                messages[messages.length - 1].content : "There's no messages yeat..."
          }</p>
        }
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  isAuth: state.userReducer.isAuth,
  currentChat: state.chatReducer.chat
})


export default connect(mapStateToProps, { startChatReq })(ConversationListItem)
