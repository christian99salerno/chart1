const express = require('express');
const path = require('path');
const moongose = require('mongoose');
const Simulation = require('./models/simulation.js');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

//connessione al database mongo
moongose.connect("mongodb://127.0.0.1:32768/simulations", function (err) {

  if(err) {
    process.exit(1);
  }

  http.listen(3000);

});

app.use( '/css', express.static(path.resolve(__dirname, 'css') ) );

app.use( '/', function (req, res) {
  res.sendFile( path.resolve(__dirname, 'public', 'index.html') );
} );

app.use( function (req, res) {
  res
    .status(404)
    .end('page not found');
} );

//connessione al server
io.on('connection', function (socket) {
  console.log('user connected');
  Simulation.find({},{ titolo:1 } ).exec( function(err, result) {
    if(err){
      console.log(err);
    }
  socket.emit('grafici', result);
  });

  let id = null;

  //uscita dalla pagina
  socket.on('disconnect', function () {
    console.log('remember to stop');
    if (id) {
      clearInterval(id);
    }
  });

  //salvataggio dati on richiesta dal client
  socket.on('save', function (dati) {
    var simulation = new Simulation(dati);
    simulation.save();
  });

  //cancellazione grafico
  socket.on('cancellaGrafico', function (dato) {
  Simulation.remove({ _id : dato.id }).exec( function (err) {
    if(err){
      console.log(err);
    }
    
    socket.emit('aggiornamento', { id: dato.id });
  });
  });

  //start on richiesta di invio dati al grafico
  socket.on('start', function () {
    console.log('start');
    console.log(P0);
    id = setInterval( function () {
      const data = generateData();
      console.log('data', data);
      socket.emit('data', {
        value: data
      });
      t += 0.1;
    }, 1000);
  });

  //stop on richiesta di interruzione del grafico
  socket.on('stop', function (data) {
    P0=data.p0;
    console.log('stop');
    console.log(P0);
    if (id) {
      clearInterval(id);
      t = 0;
    }
  });

  //invio dati singolo grafico su richiesta
  socket.on('datiGrafico', function(graficoId) {
    Simulation.findOne( { _id:graficoId } ).exec( function(err, result) { 
    socket.emit('invioDati', { dati:result } );
    }); 
  });

  //on data change
  socket.on('dati', function (data) {
    P0 = data.P0;
    N = data.N;
    M = data.M;
    t = 0;
  });
});

let t = 0;
let P0 = 100;
let N = 0.5;
let M = 0.4;

//funzione di genrazione dati
function generateData () {
  return P0 * Math.exp( (N-M) * t );
}
