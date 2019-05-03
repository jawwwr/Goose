import React from 'react';
import "./styles.scss"
export const ChatRoom = (props) => {
  const { active_room, active_room_name } = props.data
  const { members = [] } = active_room
  console.log(members)
  return (
    <div className="Wrapper chat-room">
        <h2 className="room-name">{active_room_name}</h2>
        <div className="chat-window">
          <div className="chat-container">
            <p>Hi</p>
          </div>
          <div className="members-container">
          {
            members.map((item) => {
              return <p key={item._id}>{item.user_name}</p>
            })
          }
          </div>
        </div>
    </div>
  )
}