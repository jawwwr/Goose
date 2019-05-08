import React from 'react';
import './styles.scss';

export const Rooms = (props) => {
  const { title, data, switchRoom, addRoom } = props;

  return (
    <div className="rooms">
        <div className="title-action">
        <p className="type">{title}</p>
        {
          title==='Groups' ?
          <p className="type action" onClick={addRoom}>+</p> :
          ''
        } 
        </div>
        {
          data.length !== 0 ?
          data.map((item)=> {
          return (
            <div key={item._id} className="room">
              <div onClick={()=>switchRoom(item)} className="room-name">{item.room_name}</div>
            </div>
          )
          })
          : ''
        }
    </div>
  )
}