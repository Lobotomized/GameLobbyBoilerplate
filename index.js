const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const newG = require('./globby').newIOServer;
const delayStartBlocker = require('./blockers').delayStartBlocker


app.use('/static', express.static('public'))

newG({
  baseState:{
    //Starting State
    test:5
  },
  moveFunction:function(player,move,state){
    //State Change on Move
  },
  minPlayers:2,
  maxPlayers:3, // Number of Players you want in a single game
  timeFunction:function(state){
    state.test +=5;
    //State Change on every frame
  },
  startBlockerFunction:delayStartBlocker(1000),
  joinBlockerFunction:function(minPlayers,maxPlayers,currentPlayers,state){
      /*
        Return true if you want the user to join the same room AND false to return a new room
      */
    if(state.started){
      return false;
    }
    else{
      return true;
    }
  },
  statePresenter:function(state,playerRef){
    
    return state;
  },
  connectFunction:function(state,playerRef){
    state[playerRef] = {
      x:50,
      y:50
    }
  },
  disconnectFunction:function(state,playerRef){
    state[playerRef] = undefined;
  }
},

io)


app.get('/', function(req, res){
    return res.status(200).sendFile(__dirname + '/index.html');
  });


http.listen(3005, function(){
  console.log('listening on *:3000');
});