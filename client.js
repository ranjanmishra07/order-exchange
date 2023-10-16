const { PeerRPCClient } = require('grenache-nodejs-http');
const Link = require('grenache-nodejs-link');

const link = new Link({
  grape: 'http://127.0.0.1:30001',
});
link.start();

const peer = new PeerRPCClient(link, {});
peer.init();

const payload = {
    type : "order",
    order : {
        id: 1,
        price: 50,
        quantity: 10,
    }
};

peer.request('order-matching', payload, { timeout: 10000 }, (err, data) => {
  if (err) {
    console.error("error ----", err);
  } else {
    console.log("response from server", data.message); // Response from the server
  }
});