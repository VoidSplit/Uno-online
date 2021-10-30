/**
 * define all sections & these actions (buttons)
 */
let homeSection = document.getElementById('home')
let joinSection = document.getElementById('join')
let createSection = document.getElementById('create')
let waitingSection = document.getElementById('waiting')
let gameSection = document.getElementById('game')


/**
 * get all informations from the create and join section's form
 */

const usernameInput = document.getElementById('username')
const joinUsernameInput = document.getElementById('joinUsername')
const roomNameInput = document.getElementById('roomName')
const maxPlayersInput = document.getElementById('maxPlayer')
const privateCheck = document.getElementById('privacity')
const roomListDOM = document.getElementById('roomList')
const playerListDOM = document.getElementById('playerList')
const linkToShare = document.getElementById('link-to-share')

/**
 * define the player object template
 */

const player = {
  host: false,
  roomId: null,
  roomName: "",
  roomMaxPlayers: null,
  deck: {},
  pass: false,
  username: "",
  socketId: "",
  private: false,
  turn: false,
  win: false
};
/**
 * get the rooms and display them
 */
socket.emit('get rooms');

socket.on('list rooms', (rooms) => {
  let html = "";

  if(rooms.length > 0) {
    rooms.forEach(room => {
      if(room.players.length !== room.players[0].roomMaxPlayers) {
        html += `<div class="item">
                  <p class="name">${room.players[0].roomName}</p>
                  <p class="count">${room.players.length}/${room.players[0].roomMaxPlayers}</p>
                  ${room.players.length == room.players[0].roomMaxPlayers ? '<button data-room="` + room.id + `" class="roomButtonFull">Game Full</button>' : `<button data-room="` + room.id + `" class="roomButton">Rejoindre la salle</button>`}
                </div>`;
      }
    });
  }
  /**
   * adding event listener to the buttons on room list items
   */
  roomListDOM.innerHTML = html;
  for(const element of document.getElementsByClassName('roomButton')) {
    element.addEventListener('click', joinRoom, false)
  }
})

/**
 * get the create section's form and fill the player template with theses informations
 */
$("#formCreate").on('submit', function (e) {
  e.preventDefault();
  // if player has choose a name
  if(usernameInput.value !== "") {
    player.username = usernameInput.value;
  }
  // if player didn't choose a name
  else {
    player.username = "Anonymous";
  }
  player.host = true;
  player.turn = true;
  player.socketId = socket.id;
  if(roomNameInput.value !== "") {
    player.roomName = roomNameInput.value;
  } else {
    player.roomName = `Salon de ${player.username}`;
  }
  player.roomMaxPlayers = maxPlayersInput.value;
  player.private = privacity.checked;
  waitingSection.classList.remove('disabled')
  createSection.classList.add('disabled')

  // emit the playerData to the server
  socket.emit('playerData', player);
  
  socket.emit('list rooms');
})

/**
 * when the game start we call the function startGame()
 */
socket.on("start game", (players) => {
  startGame(players);
});
/**
 * when the owner join a room we display the link to share the room with other people
 */
socket.on('join room', (roomId, player, room) => {
  let htmlUser = "";
  player.roomId = roomId;
  linkToShare.innerHTML = `<a href="${window.location.href}?room=${player.roomId}" target="_blank">${window.location.href}?room=${player.roomId}</a>`;
  
  
  if(room.players.length > 0) {
    room.players.forEach(player => {
      htmlUser += `<div class="playerItem">
                    <div class="username">${player.username}</div>
                    <div class="category">${player.host ? 'Owner' : 'Player'}</div>
                  </div>`
    });
  }
  playerListDOM.innerHTML = htmlUser;
  

  // moove the user to the waiting room
  homeSection.classList.add('disabled')
  joinSection.classList.add('disabled')
  createSection.classList.add('disabled')
  waitingSection.classList.remove('disabled')
});


socket.on('refresh players', (roomId, player, room) => {
  let htmlUser = "";
  if(roomId) {
    player.roomId = roomId;
    linkToShare.innerHTML = `<a href="${window.location.href}?room=${player.roomId}" target="_blank">${window.location.href}?room=${player.roomId}</a>`;
  } 
  if(room.players.length > 0) {
    room.players.forEach(player => {
      htmlUser += `<div class="playerItem">
                    <div class="username">${player.username}</div>
                    <div class="category">${player.host ? 'Owner' : 'Player'}</div>
                  </div>`
    });
  }
  playerListDOM.innerHTML = htmlUser;
});



/*
TODO start the game 
TODO give all players a deck
TODO ...
*/
function startGame(players) {
  console.log("start")
}
/**
 * when someone is joining the room with the buttons this function is called
 */
const joinRoom = function() {
  // if player has choose a name
  if(joinUsernameInput.value !== "") {
    player.username = joinUsernameInput.value;
    player.socketId = socket.id;
    player.roomId = this.dataset.room;

    socket.emit("playerData", player);
  }
  // if player didn't choose a name
  else {
    player.username = "Anonymous";
    player.socketId = socket.id;
    player.roomId = this.dataset.room;

    socket.emit("playerData", player);
  }
}

function joinParty() {
  /**
   * refresh all the lists
   */
  homeSection.classList.toggle('disabled')
  joinSection.classList.toggle('disabled')
  socket.emit('list rooms');
}
function createParty() {
  /**
   * refresh all the lists
   */
  homeSection.classList.toggle('disabled')
  createSection.classList.toggle('disabled')
  socket.emit('list rooms');
}
function playButton() {
  /**
   * refresh all the lists
   */

  socket.emit('list rooms');
}
function cancel() {
  /**
   * refresh all the lists
   */
  socket.emit('list players');
  socket.emit('list rooms');
  location.reload(); // reload the page for cancel and disconnect if connected 
}