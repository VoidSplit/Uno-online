/**
 * define all sections & these actions (buttons)
 */
let homeSection = document.getElementById('home')
let joinSection = document.getElementById('join')
let createSection = document.getElementById('create')
let waitingSection = document.getElementById('waiting')

function joinParty() {
  homeSection.classList.toggle('disabled')
  joinSection.classList.toggle('disabled')
}
function createParty() {
  homeSection.classList.toggle('disabled')
  createSection.classList.toggle('disabled')
}
function cancel() {
  homeSection.classList.remove('disabled')
  joinSection.classList.add('disabled')
  createSection.classList.add('disabled')
  
}

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
      if(room.players.length !== 2) {
        html += `<div data-room="${room.id}" class="item">
                  <p class="name">${room.players[0].roomName}</p>
                  <p class="count">1/${room.players[0].roomMaxPlayers}</p>
                  <button class="roomButton">Rejoindre la salle</button>
                </div>`;
      }
    });
  }
  /**
   * adding event listener to the buttons on room list items
   */
  if(html !== "") {
    roomListDOM.innerHTML = html;
    for(const element of document.getElementsByClassName('roomButton')) {
      element.addEventListener('click', joinRoom, false)
    }
  }
})
/**
 * get the create section's form and fill the player template with theses informations
 */
$("#formCreate").on('submit', function (e) {
  e.preventDefault();
  player.username = usernameInput.value;
  player.host = true;
  player.turn = true;
  player.socketId = socket.id;
  player.roomName = roomNameInput.value;
  player.roomMaxPlayers = maxPlayersInput.value;
  player.private = privacity.checked;
  waitingSection.classList.remove('disabled')
  createSection.classList.add('disabled')

  // emit the playerData to the server
  socket.emit('playerData', player);
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
  console.log("Utilisateur connecté a la salle")
  
  console.log(player, room)/*
  if(player.host === true) {
  }
  
  if(rooms.length > 0) {
    players.forEach(room => {
      if(room.players.length !== 2) {
        htmlUser += `<div class="playerItem">
                      <div class="username">${player.username}</div>
                      <div class="category">Owner</div>
                    </div>`
      }
    });
  }
  if(htmlUser !== "") {
    playerListDOM.innerHTML = htmlUser;
  }
*/






  // moove the user to the waiting room
  homeSection.classList.add('disabled')
  joinSection.classList.add('disabled')
  createSection.classList.add('disabled')
  waitingSection.classList.remove('disabled')
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
