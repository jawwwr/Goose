import React from 'react';
import "./styles.scss"

export const ChatRoom = (props) => {
  const { data, divRef } = props
  return (
    <div className="Wrapper chat-room">
      <div className="list">
      {
        data.map((item) => {
          return <div 
              className={item.sender.user_name === localStorage.getItem('goose_user_name') ? "msg right" : "msg left"}
              key={item._id}>
              <p>
              {item.sender.user_name}
              </p>
              <p>
              {item.text}
              </p>
            </div>
        })
      }
      <div ref={divRef} />
      </div>
    </div>
  )
}