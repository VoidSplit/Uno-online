const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let rooms = []; // define the list of the rooms actually not empty

/**
 * define all the Routes (jquery & public directory)
 */
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

/**
 * when user is looking the page he's connected
 */

io.on('connection', (socket) => {
  console.log(`[user connexion] ${socket.id}`);

  /**
   * playerData is a emiter wich contain all the player informations (host, roomId, roomName, roomMaxPlayers, deck, etc..)
   * it is emit when all the player's information is collected
   */
  socket.on('playerData', (player) => {
    console.log(`[playerData] ${player.username}`)

    let room = null; // clear the temp variable

    /**
     * if the player does not have a room, we create one for him
     */
    if(!player.roomId) {
      room = createRoom(player);
      console.log(`[create room] ${room.id} ${player.username}`)
    } else {
      /**
       * else, we push the player into the room
       */
      room = rooms.find(r => r.id == player.roomId);

      if(room === undefined) { // if the room is undefined we cancel the action
        return;
      }
      room.players.push(player); // push the player on the room players list
    }
    /**
     * after the player has joined the list he is made to join the room
     */
    socket.join(room.id); 
    /**
     * refresh all the list that need to be refresh
     */
    io.in(room.id).emit('refresh players', room.id, player, room)
    io.emit('list rooms', rooms)
    
    io.to(socket.id).emit('join room', room.id, player, room)

    /**
     * if the room is full, the game start
     */
    // TODO Create an interface with a start game button
    if(room.players.length === room.players[0].roomMaxPlayers) {
      io.to(room.id).emit('start game', room.players)
    }
  });

  /**
   * this collector is use to get the rooms and send to the client to display them on the join section
   */
  socket.on('get rooms', () => {
    io.to(socket.id).emit('list rooms', rooms)
  })
  /**
   * when disconnected, the player's room will be deleted
   */
  socket.on('disconnect', () => {
    console.log(`[user disconnect] ${socket.id}`);
    let room = null; // clear the temp variable

    /**
     * we filter all the rooms availables
     */
    rooms.forEach(r => {
      r.players.forEach((p, index) => {
        if(p.socketId === socket.id && p.host) {
          room = r;
          rooms = rooms.filter(r => r !== room);
        }
        // delete the user when disconnect
        if(p.socketId === socket.id ) {
          let user = p;
          let userIndex = r.players.indexOf(user);
          r.players.splice(userIndex, userIndex)
        }
        io.in(p.roomId).emit('refresh players', null, p, r) // refresh player list for all clients
        
      })
    })
    io.emit('list rooms', rooms) // refresh rooms if a room has been deleted
  });
});

/**
 * we listen the port 3000 to display the website on this port
 */
server.listen(3000, () => {
  console.log('listening on port 3000');
});

/**
 * this function create the room 
 */
function createRoom(player) {
  const room = { id: roomId(), players: [] };

  player.roomId = room.id;
  room.players.push(player);
  rooms.push(room);

  return room;
}

/**
 * this function create the room ID
 */
function roomId() {
  return Math.random().toString(36).substr(2, 9);
}