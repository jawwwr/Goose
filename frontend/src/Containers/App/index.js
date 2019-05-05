import React, { Component } from 'react';
import axios from 'axios';
import { Login } from '../../Components/Login'
import Home from '../Home'

import { apiUrl } from '../../Services/api'
import './styles.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this._login = this._login.bind(this)
    this._onChangeUserName = this._onChangeUserName.bind(this)
    this.state = {
      user_name: '',
      authenticated: false,
    };
  }

  componentWillMount() {
    if(localStorage.getItem("goose_user_id")){
      this.setState({
        authenticated: true
      })
    }
  }

  _login = async ()=> {
    let response = []
    if(this.state.user_name !== '') {
       response = await axios.post(`${apiUrl}/user`,  {
        user_name: this.state.user_name,
      })
      if(response.status === 200) {
        await axios.put(`${apiUrl}/room/5cca9c77cc29f540e48b3958`,  {
          members: response.data._id,
        })
        localStorage.setItem("goose_user_id", response.data._id)
        localStorage.setItem("goose_user_name", response.data.user_name)
        window.location.reload()
      }
    } else {
      alert("username pls")
    }
  }

  _onChangeUserName(event) {

    this.setState({
      user_name: event.target.value
    })
  }

  render() {
    return (
        <div className="App">
          {
            this.state.authenticated ? (
              <Home/>
            ) : (
              <Login
                user_name={this.state.user_name}
                login={this._login}
                onChangeUser={this._onChangeUserName}
              />
            )
          }
        </div>
    );
  }

}


export default App;
