import React, { Component } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { withRouter } from "react-router";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Alert from 'react-s-alert';
import { Rooms } from '../../Components/Rooms'
import { ChatContainer } from '../../Components/ChatContainer'
import { Login } from '../../Components/Login'
import { apiUrl } from '../../Services/api'
import { socket, onNewUser, onSendChat, onAddRoom, onSendInvitation, onAcceptedInvite, onBuzz } from '../../Services/socket'
import 'react-toastify/dist/ReactToastify.css';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import './styles.scss';

import buzz from  '../../Assets/sounds/buzz.mp3'
import junel from  '../../Assets/sounds/junel.mp3'

class App extends Component {
  constructor(props) {
    super(props);
    this._handleMessageChange = this._handleMessageChange.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
    this._login = this._login.bind(this)
    this._onAddRoom = this._onAddRoom.bind(this)
    this._onChangeUserName = this._onChangeUserName.bind(this)
    this._onLogout = this._onLogout.bind(this)
    this._onSwitchRoom = this._onSwitchRoom.bind(this)
    this._onClickUser = this._onClickUser.bind(this)
    this._scrollToBottom = this._scrollToBottom.bind(this)
    this._notify = this._notify.bind(this)
    this._onAcceptInvite = this._onAcceptInvite.bind(this)
    this.state = {
      authenticated: false,
      me: '',
      user_name: '',
      loading: false,
      active_room: {
        _id: '5cd0ee281aa16c2b3de5392b',
      }, //default active room is General
      rooms: [],
      messages: [],
      chat_message: '',
    };
  }

  messagesEnd = React.createRef()

  async componentDidMount() {
    socket.on('connect', () => {
      console.log("Connect to socketio.")
    })


    const savedId = localStorage.getItem("goose_user_id");
    if(savedId){
      // get user data
      const response = await axios.get(`${apiUrl}/user/${savedId}`)
      // get all messages
      const messages = await axios.get(`${apiUrl}/chat`)
      // get all rooms
      const rooms = await axios.get(`${apiUrl}/room`)
      // get all default room
      const room = await axios.get(`${apiUrl}/room/${this.state.active_room._id}`)
      this.setState({
        me: response.data,
        authenticated: true,
        messages: messages.data,
        active_room: room.data,
        rooms: rooms.data,
      })

      // emit to socket for reconnecting user, this is when reloaded.
      onNewUser({user: response.data, rooms: rooms.data, socket_id: socket.id, source: 'reconnect'})

    } else {
      this.setState({
        authenticated: false
      })
    }

      // socket Listeners

      // when message successfully sent
      socket.on('new_message', (data) => {
        console.log(data)
        this.setState({
          messages: [
            ...this.state.messages,
            data
          ]
        })
      }); 

      // when someone new user or reloaded the browser.
      socket.on('new_recon_app_user_notify', ({data, message}) => {
        const active = data.rooms.filter(room => {
          return room._id === this.state.active_room._id
        })
        this.setState({
          rooms: data.rooms,
          active_room: active[0]
        })
        
        this._notify(`${data.user.user_name} ${message}!`)
        this._notify(`${data.user.user_name} ${message}!`)
      }); 

      // when someone new user or reloaded the browser.
      socket.on('new_recon_app_user_update', ({data, message}) => {
        this.setState({
          rooms: data.rooms,
          me: data.user
        })
        this._notify(`${data.user.user_name} ${message}!`)
      }); 

      // when new room added
      socket.on('new_room', (data) => {
        this.setState({
          rooms: [
            ...this.state.rooms,
            data
          ]
        })
      }); 

      // when new room added, update my list.
      socket.on('new_room_update_me', (data) => {
        this.setState({
          me: data.user,
        })
      }); 

      // when new room added, update my list.
      socket.on('notify_new_convo', (data) => {
        console.log(data)
        this._notify(data.message); 
      }); 


      socket.on('invitation_notify', (data) => {
        console.log(data)
        toast(<this.NotifyAction 
          acceptInvite={this._onAcceptInvite}
          data={data}/>, {
          closeButton: false,
          autoClose: false,
          draggable: false,
          hideProgressBar: true,
          position: toast.POSITION.BOTTOM_LEFT,
          className: 'goose-toast invite'
        })
      }); 

      socket.on('invitation_accepted', (data) => {
        this._notify(data.message); 
    });
    // buzzzzerrrr
      socket.on('buzz_all', (data) => {
        Alert.info(data, {
          position: 'bottom-left',
          effect: 'slide',
          beep: junel
      });
    });
  }
  async componentDidUpdate(prevProps, prevState) {
    if(this.state.authenticated) {
      this._scrollToBottom()
    }
  }

  _handleMessageChange(event) {
    this.setState({
      chat_message: event.target.value
    })
  }

  _handleSubmit = async (event)=> {
    event.preventDefault();
    const data = {
      room: this.state.active_room._id,
      sender: this.state.me._id,
      text: this.state.chat_message
    }
    const response = await axios.post(`${apiUrl}/chat`, data)

    onSendChat(response.data)

    this.setState({
      chat_message: ''
    })
  }

  _login = async ()=> {
    if(this.state.user_name !== '') {
      const response = await axios.post(`${apiUrl}/user`,  {
        user_name: this.state.user_name,
        rooms: this.state.active_room._id
      })

      localStorage.setItem("goose_user_id", response.data.user._id)
      localStorage.setItem("goose_user_name", response.data.user.user_name)

      window.location.reload()
    } else {
      alert("username pls")
    }
  }

  _onAddRoom = async () => {
    const room_name = prompt("Please enter new room name:");
    const creator = this.state.me._id
    if (room_name != null && room_name !== "") {
      const response = await axios.post(`${apiUrl}/room`, {room_name, type: 'group', creator, members: creator})
      onAddRoom(response.data)
    }
  }

  _onChangeUserName(event) {
    this.setState({
      user_name: event.target.value
    })
  }
  
  _onLogout() {
    this.setState({
      authenticated: false
    })
    localStorage.removeItem('goose_user_id')
    localStorage.removeItem('goose_user_name')
  }
  
  _onSwitchRoom = (data) => {
    console.log(data)
    this.setState({
      active_room: data,
    })
    this.props.history.push(`/${data.room_name}`)
  }
  
  _onClickUser = async (id, name) => {
    const { _id, user_name } = this.state.me

    // check if these two ids exist in a private room
    const response = await axios.get(`${apiUrl}/room/check/private/${_id}/${id}`)

    if(response.data.length === 0) {
      const response = await axios.post(`${apiUrl}/room`, {room_name: `${_id}${id}`, type: 'private', creator: _id, members: [_id, id]})
      const message = `${user_name} initiated a chat with you.`
      const data = {
        ...response.data,
        message,
        recipient: {
          name,
          _id: id
        }
      }
      onAddRoom(data)
      // onAddRoom(response.data)
    } else {
      const { _id } = this.state.me
      const { members } = response.data[0]
      let result = members.filter(member => member._id !== _id)
      const active = {
        ...response.data[0],
        room_name: result[0].user_name
      }
      this._onSwitchRoom(active)
    }
  }

  _scrollToBottom() {
    this.messagesEnd.current.scrollIntoView()
  }
  
  _notify = (message) => {
    toast(message, {
      autoClose: 3000,
      draggable: false,
      hideProgressBar: true,
      position: toast.POSITION.BOTTOM_LEFT,
      className: 'goose-toast'
    });
  }
  
  _onAcceptInvite = (data) => {
      onAcceptedInvite(data)
  }
  
  _onBuzzer = () => {
    onBuzz(this.state.me.user_name)
  }

  NotifyAction = (props, { closeToast }) => {
    const {data, acceptInvite} = props
    return (
      <div className="notify-action">
        <p>{data.message}</p>
        <div className="actions">
          <button className="action yes" onClick={()=>acceptInvite(data)}>Yes</button>
          <button className="action no" onClick={closeToast}>No</button>
        </div>
      </div>
    )
  }

  render() {
    const { rooms, messages, active_room } = this.state
    const active_room_message = messages.filter(function (message) {
      return message.room._id === active_room._id;
    });

    const privates = []
    const groups = []
    rooms.map( (item, i) => {
      if(item.type === 'private'){
        const { members } = item
        const myChat = members.filter(member => member._id === this.state.me._id)
        if(myChat.length !== 0) {
          let private_room = {}
          const other = members.filter(member => member._id !== this.state.me._id)
          private_room = {
            ...item,
            room_name: other[0].user_name
  
          }
          privates.push(private_room)
        };
        return privates
      }else {
       return groups.push(item)
      }
    })

    return (
      <Router>
        <div className="App">
        {
            !this.state.authenticated ? (
              <Login
                user_name={this.state.user_name}
                login={this._login}
                onChangeUser={this._onChangeUserName}
              />
            ) : (
              <div className="App-container">
              <div className="logout-btn">
                {
                  this.state.me !== '' ? this.state.me.user_name : ''
                }
                <button onClick={this._onLogout}>logout</button>
              </div>
              <div className="container sidebar rooms">
                <h1 className="brand-name">Goose</h1>
                <div className="tabs">
                  <p className="tab-title">Messages</p>
                    {
                      privates.length !== 0 || groups.length !== 0 ?
                      <div className="room-container">
                        <Rooms
                        title={"Direct"}
                        switchRoom={this._onSwitchRoom}
                        data={privates}
                      />
                      <Rooms 
                        title={"Groups"}
                        switchRoom={this._onSwitchRoom}
                        addRoom={this._onAddRoom} 
                        data={groups}
                      />
                      </div>
                      : ''
                    }
                </div>
              </div>
              <div className="container main">
              <ChatContainer
                divRef={this.messagesEnd}
                onBuzz={this._onBuzzer}
                chat_message={this.state.chat_message}
                clickUser={this._onClickUser}
                handleChange={this._handleMessageChange}
                handleSubmit={this._handleSubmit}
                active_room_msg={active_room_message}
                active_room={active_room}

              />
              </div>
          </div>
            )
          }
          <ToastContainer />
          <Alert stack={{limit: 5}} />
          </div>
      </Router>
    );
  }

}


export default withRouter(App);
