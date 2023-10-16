const { PeerRPCServer } = require('grenache-nodejs-http');
const Link = require('grenache-nodejs-link');

const orderBook = [];
const processingLock = { locked: false };
const requestQueue = [];

const link = new Link({
  grape: 'http://127.0.0.1:30001',
});
link.start();

const peer = new PeerRPCServer(link, {
  timeout: 300000,
});
peer.init();

const service = peer.transport('order-matching');
service.listen(4001);


setInterval(function () {
  link.announce('order-matching', service.port, {})
}, 1000)

service.on('request', (rid, key, payload, handler) => {
  console.log("coming here with payload", payload);
  if(payload.type === "order" && payload.order?.id) {
    // If processing is locked, add the request to the queue
    if (processingLock.locked) {
      requestQueue.push({ payload, handler });
    } else {
      processOrder(payload, handler);
    }  }
});

async function processOrder(payload, handler) {
  // Implement order matching logic
  // Update order book
  // Respond to clients with trade results


   // Lock the processing to avoid race conditions
   processingLock.locked = true;
   const order = payload.order;

   try {
     // Simulate an asynchronous operation 
     console.log("coming ", 1);
     await new Promise((resolve) => setTimeout(resolve, 1000));
     console.log('coming', 2);
 
     const matchedOrders = [];
     const indexToUpdate = orderBook.findIndex((a) => a.id === order.id);
     if (indexToUpdate !== -1) {
       orderBook[indexToUpdate].price += order.price;
       orderBook[indexToUpdate].quantity += order.quantity;

       console.log("match order updated", orderBook);
       handler.reply(null, { message: `Order updated successfully for orderId ${order.id}` });
     } else {
       orderBook.push({
         id: order.id,
         price: order.price || 0,
         quantity: order.quantity || 0,
       });
       console.log("order pushed ", orderBook);
       handler.reply(null, { message: `Order created successfully for orderId ${order.id}` });
     }
   } finally {
     processingLock.locked = false;
     // Process the next request in the queue if any
     const nextRequest = requestQueue.shift();
     if (nextRequest) {
       processOrder(nextRequest.payload, nextRequest.handler);
     }
   }
}
