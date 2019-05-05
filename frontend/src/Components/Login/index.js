import React from 'react';
import "./styles.scss"

export const Login = (props) => {
  const { user_name, login, onChangeUser } = props
  return (
    <div className="Wrapper user-login">
        <input 
          value={user_name} 
          onChange={onChangeUser} 
        />
        <label htmlFor="login" onClick={login}>login</label>
        <input className="login-btn" id="login" type="submit" value="Submit" />
    </div>
  )
}