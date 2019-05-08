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

const onJoinRoom = (data) => {
    socket.emit('join_room', data);
}

const onSendInvitation = (data) => {
    socket.emit('send_chat_invite_room', data);
}

const onAcceptedInvite = (data) => {
    socket.emit('send_chat_invite_accepted', data);
}

const onCanceledInvite = (data) => {
    socket.emit('send_chat_invite_denied', data);
}


export {
    socket,
    onNewUser,
    onSendChat,
    onAddRoom,
    onJoinRoom,
    onSendInvitation,
    onAcceptedInvite,
    onCanceledInvite
}

