import React from 'react';
import {ChatInput} from '../ChatInput'
import {ChatRoom} from '../ChatRoom'
import "./styles.scss"

export const ChatContainer = (props) => {
  const { data, handleChange, handleSubmit, chat_message, divRef } = props
  const { active_room, active_room_name, messages } = data
  const { members = [] } = active_room
  return (
    <div className="Wrapper chat-room">
        <h2 className="room-name">{active_room_name}</h2>
        <div className="chat-window">
          <div className="chat-container">
            <ChatRoom
              data={messages}
              divRef={divRef}
            />
            <ChatInput 
              chat_message={chat_message}
              handleSubmit={handleSubmit}
              handleChange={handleChange}/>
          </div>
          <div className="members-container">
          <h3>Members</h3>
          <div className="list">
            {
              members.map((item) => {
                return <p key={item._id}>{item.user_name}</p>
              })
            }
          </div>
          </div>
        </div>
    </div>
  )
}