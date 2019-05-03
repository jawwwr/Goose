import React, { Component } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { withRouter } from "react-router";
import axios from 'axios';
import { Rooms } from '../../Components/Rooms'
import { ChatRoom } from '../../Components/ChatRoom'
import { apiUrl } from '../../Services/api'
import { initializeSocket } from '../../Services/socket'
import './styles.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this._mainWindow = this._mainWindow.bind(this)
    this._fetchActiveRoomDetails = this._fetchActiveRoomDetails.bind(this)
    this._fetchActiveRoomMessage = this._fetchActiveRoomMessage.bind(this)
    this._onSwitchRoom = this._onSwitchRoom.bind(this)
    this.state = { 
      loading: false,
      active_room: false,
      active_room_name: '',
      rooms: [],
      messages: []
    };
  }

  async componentDidMount() {
    initializeSocket()
    this.setState({
      loading: true
    })

    const response = await axios.get(`${apiUrl}/room`)

    const general = response.data
    .filter(obj => obj.room_name === "General")

    const id = general[0]._id;
    this.setState({
      rooms: response.data,
      active_room_name: general[0].room_name,
      loading: false
    })

    this._fetchActiveRoomMessage(id)
    this._fetchActiveRoomDetails(id)
    this.props.history.replace(general[0].room_name)
    
  }

  _onSwitchRoom = (id) => () => {
    this._fetchActiveRoomMessage(id)
    this._fetchActiveRoomDetails(id)
  }

  async _fetchActiveRoomMessage(id) {
    const response = await axios.get(`${apiUrl}/chat`)
  }

  async _fetchActiveRoomDetails(id) {
    const response = await axios.get(`${apiUrl}/room/${id}`)
    this.setState({
      active_room_name: response.data.room_name,
      active_room: response.data
    })
  }

  _mainWindow({ match }) {
    return (
      <ChatRoom
        id={match.params.id}
        data={this.state}
      />
    );
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
      <div className="App">
        <div className="App-container">
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
            <ChatRoom
              data={this.state}
            />
            </div>
        </div>
      </div>
      </Router>
    );
  }

}


export default withRouter(App);
