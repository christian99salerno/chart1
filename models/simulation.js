var mongoose = require('mongoose');

var simulationSchema = new mongoose.Schema({
  titolo: { type:String, required:true },
  nat: { type:Number, required:true },
  mort: { type:Number, required:true },
  values: { type: [], required:true }
});

module.exports = mongoose.model('Simulation', simulationSchema);
