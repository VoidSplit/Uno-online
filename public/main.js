
let homeSection = document.getElementById('home')
let joinSection = document.getElementById('join')
let createSection = document.getElementById('create')

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

const usernameInput = document.getElementById('username');
const joinUsernameInput = document.getElementById('joinUsername');
const roomNameInput = document.getElementById('roomName');
const maxPlayersInput = document.getElementById('maxPlayer');
const privateCheck = document.getElementById('privacity');
const waitingSection = document.getElementById('waiting');
const roomListDOM = document.getElementById('roomList');


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
  if(html !== "") {
    roomListDOM.innerHTML = html;
    for(const element of document.getElementsByClassName('roomButton')) {
      element.addEventListener('click', joinRoom, false)
    }
  }
})

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

  socket.emit('playerData', player);
})

socket.on("start game", (players) => {
  startGame(players);
});

function startGame(players) {
  console.log("start")
}
const joinRoom = function() {
  console.log('test')
  if(joinUsernameInput.value !== "") {
    player.username = joinUsernameInput.value;
    player.socketId = socket.id;
    player.roomId = this.dataset.room;

    socket.emit("playerData", player);
    console.log("L'utilisateur a rejoint la salle")
  }
  else {
    player.username = "Anonymous";
    player.socketId = socket.id;
    player.roomId = this.dataset.room;

    socket.emit("playerData", player);
    console.log("L'utilisateur a rejoint la salle")
  }
}