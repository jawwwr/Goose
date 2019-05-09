import io from'socket.io-client';
// const host_ofc = 'http://10.0.4.247:3010'
// const host_ofc = 'http://192.168.1.4:3010'
const socket = io('http://localhost:3010', {
    transports: ['websocket']
});

// Emitters

const onNewUser = (data) => {
    socket.emit('new_recon_app_user', data);
}

const onSendChat = (data) => {
    socket.emit('send_message', data);
}

const onAddRoom = (data) => {
    socket.emit('add_new_room', data);
}

const initConvo = (data) => {
    socket.emit('on_initiate_convo', data);
}

const joinUs = (data) => {
    socket.emit('join_us_convo_room', data);
}

const onBuzz = (data) => {
    socket.emit('on_buzz_all', data);
}


export {
    socket,
    onNewUser,
    onSendChat,
    onAddRoom,
    onBuzz,
    initConvo,
    joinUs
}

