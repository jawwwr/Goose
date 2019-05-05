import React from 'react';
import "./styles.scss"

export const ChatInput = (props) => {

  return (
    <div className="Wrapper chat-input">
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