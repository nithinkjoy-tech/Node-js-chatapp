const path = require("path")
const express = require("express")
const http = require("http")
const socketio = require("socket.io")
const formatMessage = require("./utils/messages")
const {
    userJoin,getCurrentUser,getRoomUsers,userLeave} = require("./utils/users")

const app = express()
const server = http.createServer(app)
const io = socketio(server)
app.use(express.static(path.join(__dirname, "public")))

const botName = "Bot"

io.on("connection", socket => {
    socket.on("joinRoom", async({
        username,
        room
    }) => {
        const user = userJoin(socket.id, username, room)

        socket.join(user.room)

        socket.emit("message", formatMessage(
            botName, "welcome to chat"))

        socket.broadcast.to(user.room).emit("message", formatMessage(
            botName,   `${user.username} has joined the chat`))

            io.to(user.room).emit("roomUsers",{
                room:user.room,
                users:getRoomUsers(user.room)
            })

    })

    

    socket.on("chatMessage",async msg => {
         const user=await getCurrentUser(socket.id)
        //console.log(others)
        io.to(user.room).emit("message", formatMessage(user.username, msg))
    })

    socket.on("disconnect", () => {
        const user=userLeave(socket.id)
        
        if(user){
            io.to(user.room).emit("message", formatMessage(botName, `${user.username} has left the chat`))

            io.to(user.room).emit("roomUsers",{
                room:user.room,
                users:getRoomUsers(user.room,socket.id)
            })
        }
        
    })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log(`server running on port ${PORT}`))

// const path = require('path');
// const http = require('http');
// const express = require('express');
// const socketio = require('socket.io');
// const formatMessage = require('./utils/messages');
// const {
//   userJoin,
//   getCurrentUser,
//   userLeave,
//   getRoomUsers
// } = require('./utils/users');

// const app = express();
// const server = http.createServer(app);
// const io = socketio(server);

// // Set static folder
// app.use(express.static(path.join(__dirname, 'public')));

// const botName = 'ChatCord Bot';

// // Run when client connects
// io.on('connection', socket => {
//   socket.on('joinRoom', ({ username, room }) => {
//     const user = userJoin(socket.id, username, room);

//     socket.join(user.room);

//     // Welcome current user
//     socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

//     // Broadcast when a user connects
//     socket.broadcast
//       .to(user.room)
//       .emit(
//         'message',
//         formatMessage(botName, `${user.username} has joined the chat`)
//       );

//     // Send users and room info
//     io.to(user.room).emit('roomUsers', {
//       room: user.room,
//       users: getRoomUsers(user.room)
//     });
//   });

//   // Listen for chatMessage
//   socket.on('chatMessage', msg => {
//     const user = getCurrentUser(socket.id);

//     io.to(user.room).emit('message', formatMessage(user.username, msg));
//   });

//   // Runs when client disconnects
//   socket.on('disconnect', () => {
//     const user = userLeave(socket.id);

//     if (user) {
//       io.to(user.room).emit(
//         'message',
//         formatMessage(botName, `${user.username} has left the chat`)
//       );

//       // Send users and room info
//       io.to(user.room).emit('roomUsers', {
//         room: user.room,
//         users: getRoomUsers(user.room)
//       });
//     }
//   });
// });

// const PORT = process.env.PORT || 3000;

// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));