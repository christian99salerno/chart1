const express = require('express');
const path = require('path');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use( '/', function (req, res) {
  res.sendFile( path.resolve(__dirname, 'public', 'index.html') );
} );

app.use( function (req, res) {
  res
    .status(404)
    .end('page not found');
} );

io.on( 'connection', function (socket) {
  console.log('user connected');

  let id = null;

  socket.on('disconnect', function () {
    console.log('remember to stop');
    if (id) {
      clearInterval(id);
    }
  });

  socket.on('start', function () {
    console.log('start');
    id = setInterval( function () {
      const data = generateData(0, 100);
      socket.emit('data', {
        value: data
      });
    }, 1000);
  });

  socket.on('stop', function () {
    console.log('stop');
    if (id) {
      clearInterval(id);
    }
  });
} );

http.listen(3000);

function generateData (min, max) {
  return Math.floor( min + Math.random() * (max-min) );
}
