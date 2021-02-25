const { createConnection } = require('shiv/connection');

module.exports = function(RED) {

  console.log('red settings', RED.settings.uiPort);

  function ShivConnection(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const { shivServer, shivSecret } = node.credentials;
    
    node.con = createConnection({
      SHIV_SERVER: shivServer,
      SHIV_SECRET: shivSecret,
      LOCAL_HOST: config.localWebHost,
      PORT: config.localWebPort,
      SHIV_BASE: 'shiv',
      SHIV_PATH: '',
    });

    node.con.on('error', (e) => {
      console.log('error', e);
    });

    node.on('input', function(msg) {
      msg.payload = msg.payload.toLowerCase();
      node.send(msg);
    });
    node.on('close', () => {
      node.con.endClient(true);
    });
  }
  RED.nodes.registerType("shiv-connection", ShivConnection, {
    credentials: {
      shivServer: {type:"text",required:true},
      shivSecret: {type:"password",required:true}
    }
  });
  
  function ShivOut(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const shiv = RED.nodes.getNode(config.connection);
    node.host = config.host;

    shiv.on('error', () => {
      node.status({fill:"red",shape:"ring",text:"error"});
    });

    shiv.con.on('connected', () => {
      node.status({fill:"green",shape:"dot",text:"connected"});
    });

    node.on('input', function(msg) {
      shiv.con.sendJson(msg.host || node.host, {
        topic: msg.topic,
        payload: msg.payload,
        _msgid: msg._msgid,
      });
    });
  }
  RED.nodes.registerType("shiv-out", ShivOut);


  function ShivIn(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const shiv = RED.nodes.getNode(config.connection);
    
    shiv.on('error', () => {
      node.status({fill:"red",shape:"ring",text:"error"});
    });

    shiv.con.on('connected', () => {
      node.status({fill:"green",shape:"dot",text:"connected"});
    });

    shiv.con.on('json', (msg) => {
      node.send(msg);
    });
  }

  RED.nodes.registerType("shiv-in", ShivIn);
}