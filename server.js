const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let rooms = [];

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


io.on('connection', (socket) => {
  console.log(`[user connexion] ${socket.id}`);

  socket.on('playerData', (player) => {
    console.log(`[playerData] ${player.username}`)
    let room = null;

    if(!player.roomId) {
      room = createRoom(player);
      console.log(`[create room] ${room.id} ${player.username}`)
    } else {
      room = rooms.find(r => r.id == player.roomId);

      if(room === undefined) {
        return;
      }
      room.players.push(player);
    }
    socket.join(room.id);
    io.to(socket.id).emit('join room', room.id)

    if(room.players.length === 2) {
      io.to(room.id).emit('start game', room.players)
    }
  });

  socket.on('get rooms', () => {
    io.to(socket.id).emit('list rooms', rooms)
  })

  socket.on('disconnect', () => {
    console.log(`[user disconnect] ${socket.id}`);
    let room = null;

    rooms.forEach(r => {
      r.players.forEach(p => {
        if(p.socketId === socket.id && p.host) {
          room = r;
          rooms = rooms.filter(r => r !== room);
        }
      })
    })
  });
});

server.listen(3000, () => {
  console.log('listening on port 3000');
});

function createRoom(player) {
  const room = {id: roomId(), players: []};

  player.roomId = room.id;
  room.players.push(player);
  rooms.push(room);

  return room;
}
function roomId() {
  return Math.random().toString(36).substr(2, 9);
}