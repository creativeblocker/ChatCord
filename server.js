const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const { userjoin, getcurrentuser, userLeave, getRoom } = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server)

//set static folder
app.use(express.static(path.join(__dirname, 'public')))

const Botname = 'ChatCord Bot'

//run when a client connects
io.on('connection', socket => {

    socket.on('joinroom', ({ username, room }) => {

        // When a client joins a room, a new user is created with a unique socket.id
        const user = userjoin(socket.id, username, room);

        socket.join(user.room)

        //Welcome current user
        socket.emit('message', formatMessage(Botname, 'Welcome to CharCord!!'))

        // Broadcast to all clients in the same room that a new user has joined
        socket.broadcast
            .to(user.room)
            .emit('message',
                formatMessage(Botname, `${user.username} has joined the chat`));


        // sends users and room info 
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoom(user.room)
        });

    })

    //listen for chatMessage
    socket.on('chatMessage', msg => {

        const user = getcurrentuser(socket.id)

        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

    //Runs when a client disconnects
    socket.on('disconnect', () => {

        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage(Botname, `${user.username} has left the chat`))

            //send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoom(user.room)
            });
        }
    });
})

const PORT = 3000 || process.env.PORT

server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));