import React from 'react';
import { Link } from "react-router-dom";
import './styles.scss';

export const Rooms = (props) => {
  const { title, data, switchRoom } = props;

  return (
    <div className="rooms">
        <p className="type">{title}</p>
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