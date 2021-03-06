import React from 'react';
import {ChatInput} from '../ChatInput'
import {ChatRoom} from '../ChatRoom'
import "./styles.scss"

export const ChatContainer = (props) => {
  const { active_room, active_room_msg, handleChange, handleSubmit, chat_message, divRef, clickUser, onBuzz } = props

  const { members, room_name } = active_room
  console.log(active_room)
  return (
    <div className="Wrapper chat-room">
        <h2 className="room-name">{room_name}</h2>
        <div className="chat-window">
          <div className="chat-container">
            <ChatRoom
              data={active_room_msg}
              divRef={divRef}
            />
            <ChatInput 
              onBuzz={onBuzz}
              chat_message={chat_message}
              handleSubmit={handleSubmit}
              handleChange={handleChange}/>
          </div>
          {
            active_room.type === 'group' ?
            <div className="members-container">
            <h3>Members</h3>
            <div className="list">
              {
                members.map((item) => {
                  return <p key={item._id} onClick={() => clickUser(item._id, item.user_name)}>{item.user_name}</p>
                })
              }
            </div>
            </div> : ''
          }
        </div>
    </div>
  )
}