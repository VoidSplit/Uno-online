/**
 * Buttons & inputs
 */

const joinPseudo = document.getElementById('joinUsername');
const createPseudo = document.getElementById('createUsernameInput');
const createPartyName = document.getElementById('partyNameInput');
const createPartyMaxPlayer = document.getElementById('playerMaxInput');
const createIsPrivate = document.getElementById('privateCheck');

/**
 * Divs wrappers
 */

const playersListBox = document.getElementById('playerList');
const roomsListBox = document.getElementById('roomList');
const shareLinkBox = document.getElementById('shareLink');


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
   roomsListBox.innerHTML = html;
  for(const element of document.getElementsByClassName('roomButton')) {
    element.addEventListener('click', joinRoom, false)
  }
})



socket.on('list players', (roomId, player, room) => {
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
})



$("#createButton").on('click', function (e) {
  e.preventDefault();
  // if player has choose a name
  if(createPseudo.value !== "") {
    player.username = createPseudo.value;
  }
  // if player didn't choose a name
  else {
    player.username = "Anonymous";
  }
  player.host = true;
  player.turn = true;
  player.socketId = socket.id;
  if(createPartyName.value !== "") {
    player.roomName = createPartyName.value;
  } else {
    player.roomName = `Salon de ${player.username}`;
  }
  player.roomMaxPlayers = createPartyMaxPlayer.value;
  player.private = createIsPrivate.checked;

  // emit the playerData to the server
  socket.emit('playerData', player);
  
  socket.emit('list rooms');
})


