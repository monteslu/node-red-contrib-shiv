const shiv = require('shiv');

module.exports = function(RED) {

  function ShivConnection(config) {
      RED.nodes.createNode(this,config);
      var node = this;
      node.on('input', function(msg) {
          msg.payload = msg.payload.toLowerCase();
          node.send(msg);
      });
  }
  RED.nodes.registerType("shiv-connection", ShivConnection);
  
  function ShivOut(config) {
      RED.nodes.createNode(this,config);
      var node = this;
      node.on('input', function(msg) {
          msg.payload = msg.payload.toLowerCase();
          node.send(msg);
      });
  }
  RED.nodes.registerType("shiv-out", ShivOut);


  function ShivIn(config) {
      RED.nodes.createNode(this,config);
      var node = this;
      node.on('input', function(msg) {
          msg.payload = msg.payload.toLowerCase();
          node.send(msg);
      });
  }
  RED.nodes.registerType("shiv-in", ShivIn);
}