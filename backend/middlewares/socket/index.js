/* eslint-disable import/prefer-default-export */
export const conneXionListener = (io, socket) => {
    socket.send('You\'re connected to the socketio')
    socket.on('error', (error) => {
        socket.send(error)
      });
    const connections = []
    connections.push(socket)
    
    socket.on('new_recon_app_user', (data) => {
        const { active } = data
        const { _id} = data.user

        socket.join(_id)
        const rooms = []
        data.user.rooms.map((item) => {
            const { _id: id} = item
            return rooms.push(id)
        })
        socket.join(rooms, () => {
            const usrNotifyOthers = {
                data,
                message: "is online, say hi!"
            }

            socket.emit('new_recon_app_user_welcome', {user: data.user, message: 'welcome!'});
            socket.to(active).emit('new_recon_app_user_update_notify', usrNotifyOthers);

        })
    })

    socket.on('send_message', (data) => {
        const { _id } = data.room
        io.in(_id).emit('new_message', data);
    })

    socket.on('on_initiate_convo', (data) => {
        const { _id: recipientId } = data.recipient
        socket.to(recipientId).emit('notify_new_convo_join', data);
        socket.emit('notify_new_convo_join', data);
    })

    socket.on('join_us_convo_room', (data) => {
        const { _id } = data.room
        socket.join(_id)
    })

    socket.on('on_buzz_all', (data) => {
        const { _id } = data.room
        socket.to(_id).emit('new_buzz', data);
    })
    
}