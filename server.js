const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)
const bodyParser = require('body-parser')
const { User } = require('./model/user')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { uri, jwt_secret } = require('./utils/config')



try {
  mongoose.connect( uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName : 'accounts'
  }).catch(e => console.log(e));

} catch (e) {
  console.log("could not connect");
  console.log(e)
}

mongoose.connection.on('connected', function() {
  console.log('Mongoose connected')
})
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose disconnected')
})

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(express.static(__dirname + '/public/pages'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.post('/api/register', async (req, res) => {
  const { username, email, password: plainTextPassword } = req.body
  const password = await bcrypt.hash(plainTextPassword, 10)
  try {
    const response = await User.findOne({
      username,
      email,
      password
    })
    if(!response) {
      let wins = 0;
      let loses = 0;
      const usr = new User({
        username,
        email,
        password,
        wins,
        loses
      })
      await usr.save()
      return res.json({ status: 'ok', data: 'Successfully created' })
    } else {
      return res.json({ status: 'error', error: 'User already exist' })
    }
  } catch(e) {
    return res.json({ status: 'error', error: 'An error as occured, please try later' })
  }
})

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({
    email: email
  })
  if(!user) {
    return res.json({ status: 'error', error: 'Invalid username/password' })
  }
  if(await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id, username: user.username }, jwt_secret)
    return res.json({ status: 'ok', data: token });
  } else {
    return res.json({ status: 'error', error: 'Invalid username/password' });
  }
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/')
})

server.listen(3000, () => {
  console.log('listening on port 3000')
})