import React from 'react';
import { Link } from "react-router-dom";
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
              <Link onClick={switchRoom(item._id)} to={`/${item.room_name}`} className="room-name">{item.room_name}</Link>
            </div>
          )
          })
          : ''
        }
    </div>
  )
}