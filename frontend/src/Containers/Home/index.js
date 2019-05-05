import React, { Component } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { withRouter } from "react-router";
import axios from 'axios';
import { Rooms } from '../../Components/Rooms'
import { ChatContainer } from '../../Components/ChatContainer'
import { apiUrl } from '../../Services/api'
import { initializeSocket } from '../../Services/socket'
import './styles.scss';

class Home extends Component {
  constructor(props) {
    super(props);
    this._fetchActiveRoomDetails = this._fetchActiveRoomDetails.bind(this)
    this._fetchActiveRoomMessage = this._fetchActiveRoomMessage.bind(this)
    this._onSwitchRoom = this._onSwitchRoom.bind(this)
    this._handleChange = this._handleChange.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
    this._scrollToBottom = this._scrollToBottom.bind(this)
    this.state = {
      my_details: false,
      loading: false,
      active_room: false,
      active_room_name: '',
      rooms: [],
      messages: [],
      chat_message: '',
    };
  }

  messagesEnd = React.createRef()

  async componentDidMount() {
    initializeSocket()
    this.setState({
      loading: true
    })

    const response = await axios.get(`${apiUrl}/room`)

    const general = response.data.filter(obj => obj.room_name === "General")

    const id = general[0]._id;
    this.setState({
      rooms: response.data,
      active_room_name: general[0].room_name,
      loading: false
    })
    this._fetchActiveRoomMessage(id)
    this._fetchActiveRoomDetails(id)
    this.props.history.replace(general[0].room_name)
    this._scrollToBottom()
  }

  componentDidUpdate () {
    this._scrollToBottom()
  }

  _onSwitchRoom = (id) => () => {
    this._fetchActiveRoomMessage(id)
    this._fetchActiveRoomDetails(id)
  }

  _fetchActiveRoomMessage = async (id) => {
    const response = await axios.get(`${apiUrl}/chat/${id}`)
    this.setState({
      messages: response.data
    })
  }

  _fetchActiveRoomDetails = async (id) => {
    const response = await axios.get(`${apiUrl}/room/${id}`)
    this.setState({
      active_room_name: response.data.room_name,
      active_room: response.data
    })
  }

  _handleChange(event) {
    this.setState({
      chat_message: event.target.value
    })
  }

  _handleSubmit = async (event)=> {
    event.preventDefault();
    const data = {
      room: this.state.active_room._id,
      sender: localStorage.getItem('goose_user_id'),
      text: this.state.chat_message
    }
    await axios.post(`${apiUrl}/chat`, data)
    this.setState({
      chat_message: ''
    })
  }
  
  _onLogout() {
    localStorage.removeItem('goose_user_id')
    localStorage.removeItem('goose_user_name')
    window.location.reload()
  }

  _scrollToBottom() {
    this.messagesEnd.current.scrollIntoView({ behavior: 'smooth' })
  }
  

  render() {
    const { rooms } = this.state
    const privates = []
    const groups = []

    rooms.map( (item, i) => {
      if(item.type === 'private'){
        return privates.push(item)
      }else {
       return groups.push(item)
      }
    })

    return (
      <Router>
        <div className="App-container">
            <div className="logout-btn">
              {
                localStorage.getItem('goose_user_name')
              }
              <button onClick={this._onLogout}>logout</button>
            </div>
            <div className="container sidebar rooms">
              <h1 className="brand-name">Goose</h1>
              <div className="tabs">
                <p className="tab-title">Messages</p>
                  {
                    privates.length !== 0 || privates.length !== 0 ?
                    <div className="room-container">
                      <Rooms
                      title={"Direct"}
                      switchRoom={this._onSwitchRoom}
                      data={privates}
                    />
                    <Rooms 
                      title={"Groups"}
                      switchRoom={this._onSwitchRoom} 
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
              chat_message={this.state.chat_message}
              handleChange={this._handleChange}
              handleSubmit={this._handleSubmit}
              data={this.state}
            />
            </div>
        </div>
      </Router>
    );
  }

}


export default withRouter(Home);
