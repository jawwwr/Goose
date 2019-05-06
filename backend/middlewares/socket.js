/* eslint-disable import/prefer-default-export */
export const conneXionListener = (io, socket) => {
    console.log('Socket connecting... ');
    socket.send('You have been connected!')
}