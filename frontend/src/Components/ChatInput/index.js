import React from 'react';
import "./styles.scss"
import buzzIcon from '../../Assets/images/buzz_ic.png'

export const ChatInput = (props) => {
  return (
    <div className="Wrapper chat-input">
      <div className="buzzer" onClick={props.onBuzz}>
        <img src={buzzIcon} alt="buzzer"></img>
      </div>
      <form onSubmit={props.handleSubmit}>
        <textarea 
          value={props.chat_message} 
          onChange={props.handleChange} />
          <label htmlFor="submit">Send</label>
          <input id="submit" type="submit" value="Submit" />
      </form>
    </div>
  )
}