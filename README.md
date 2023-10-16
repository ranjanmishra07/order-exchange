# order-exchange
Order management using p2p network

1. Run 2 grape instances
2. npm i
3. run server.js
4. run client.js (we can modify order payload of client.js and run again for checking matching order and new order creation)

   Sample payload in client.js for order,
    const payload = {
      type : "order",
      order : {
          id: 1,
          price: 50,
          quantity: 10,
      }
    };

we can modify the order contents and run client.js again . Every new order in server.js will check for unique order id and based on that it will create order or update the remainder price/quanitity of the order . 

