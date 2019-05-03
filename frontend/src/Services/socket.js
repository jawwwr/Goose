const io = require('socket.io-client');
const socket = io('http://localhost:3010', {
    transports: ['websocket']
});

// Emitters



// Listeners

export function initializeSocket() {
    socket.on('message', (data) => {
        console.log(data);
    });

}
