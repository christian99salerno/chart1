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
      const data = generateData();
      console.log('P0', P0);
      console.log('data', data);
      socket.emit('data', {
        value: data
      });
      t++;
    }, 1000);
  });

  socket.on('stop', function () {
    console.log('stop');
    if (id) {
      clearInterval(id);
      t = 0;
    }
  });

  socket.on('popIniz', function (data) {
    P0 = data.p0;
  });
} );

http.listen(3000);

let t = 0;
let P0 = 100;
let N = 10;
let M = 10.1;

function generateData () {
  return P0 * Math.exp( (N-M) * t);
}
