// Modules
// Create a http-server with a request listener 
var app = require('http').createServer(handler);
// Create a socket.io instance and bind it to the http-server
var io = require('socket.io')(app);
// To access the file system
var fs = require('fs');
// to interact with the required data
var dataManagement = require("./dataManagement");


const env = {
  "thisClient": "Niklas",
  "otherClient": "Michi",
};
// 2. import Mqtt: to communicate via the mqtt-server
const mqtt = require("mqtt");
// 2.1. connect to the server
const mqttConnection = mqtt.connect("mqtt://mqtt.hfg.design:1883/");
// 2.2. define the topic
const mqttTopic = "iot2/";

const sendingChannel = `${mqttTopic}${env.thisClient} sending to ${env.otherClient}`;
const receivingChannel = `${mqttTopic}${env.otherClient} sending to ${env.thisClient}`;

// a variable, the server can store a data pair for all the currently connected clients in
let connectedClients = [];

const emojis = [
  "0",
  "🏫",
  "👨‍👩‍👧‍👦",
  "📚",
  "🏠",
  "🔜",
  "🚗",
  "🏨",
  "🕹",
  "🍽",
  "🙆‍♂️",
  "😂",
  "🏋️",
  "🛠",
  "❗️",
  "🏁",
  "💩",
  "✔️",
  "❌",
  "👨‍💻",
  "🚶",
  "💏",
  "❤️",
  "🔥",
  "🤬",
  "😴",
  "🥳",
  "🤢",
  "👈",
  "🤝",
  "👎",
  "👍",
];

// Make the http-server listen on port 80
app.listen(80);
console.log( "Webserver is listening on Port 80" );

// Serving the site - create a http-response
function handler (req, res) {
  // new method that creates a proper response by returning a requested file or an error
  res.createResponse = (errorCode, path) => {
    fs.readFile(`${__dirname}/..${path}`, (err, data) => {
      if (err) {
        res.writeHead(errorCode);
        res.end(`Error loading ${path}`);
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  };

  if (req.method === "GET") {
    switch (req.url) {
      case "/" || "/index.html":
        res.createResponse(404, "/index.html");
        break;
      case "/styles/style.css":
        res.createResponse(406, req.url);
        break;
      case "/styles/style.css.map":
        res.createResponse(406, req.url);
        break;
      case "/javaScripts/classes.js":
        res.createResponse(405, req.url);
        break;
      case "/javaScripts/vue.js":
        res.createResponse(405, req.url);
        break;
      case "/javaScripts/socket.js":
        res.createResponse(405, req.url);
        break;
    }
  }
}


// listens for a new connection
io.on('connection', function (socket) {
  // listen for the client to send a logInTry
  socket.on("clientTrysToLogIn", (clientData) => {
    // 1. check if the data is correct
    try {
      // checks if the data is valid and returns a profile or an err
      const clientProfile = dataManagement.checkLogin(clientData);

      // return this response to the client
      socket.emit("serverReturningProfile", {
        error: false,
        profile: clientProfile,
        chats: dataManagement.getChatsWithUser(clientProfile.userID)
      });

      // now, that the client has his profile, we can make a new note in this Server
      connectedClients.push({
        socketID: socket.id,
        userID: clientProfile.userID
      });
    } catch (err) {
      // give the client an error
      socket.emit("serverReturningProfile", {error: err});
    }
  });

  socket.on("clientTrysToRegister", (clientData) => {
    try {
      // try to create a new account
      const clientProfile = dataManagement.createNewAccount(clientData);

      socket.emit("serverReturningProfile", {
        error: false,
        profile: clientProfile,
        chats: dataManagement.getChatsWithUser(clientProfile.userID)
      });

      // add this the new client connection to connectedClients
      connectedClients.push({
        socketID: socket.id,
        userID: clientProfile.userID
      });
    } catch (err) {
      // give the client an error
      socket.emit("serverReturningProfile", {error: err});
    }
  });

  // listen for a client creating a new chat
  socket.on("clientCreatingNewChat", (newChat) => {
    // const creatorID = connectedClients.find(client => client.socketID === socket.id).userID;
    
    try {
      // create the contacts to connect all participants together
      // Contacts don't really serve a purpose at this point
      const allNewContacts = [];
      newChat.users.map(userName => {
        const contactObjects = [];
        newChat.users.forEach(otherUserName => {
          let newContact;
          if (userName !== otherUserName) newContact = dataManagement.createNewContact(userName, otherUserName);
          if (newContact !== undefined) contactObjects.push(newContact);
        });
        if (contactObjects.length > 0) {
          allNewContacts.push({
            userID: dataManagement.getUserID(userName),
            contacts: contactObjects
          });
        }
      });

      // 2.1 if successfull emit the new Contacts
      allNewContacts.forEach(user => {
        const socketID = connectedClients.find(client => client.userID === user.userID).socketID;
        if (socketID !== undefined) io.to(socketID).emit("serverSendingNewContact", user.contacts);
      });

      // 3. add the chat to the dataStructure and get a chatObject in return
      const chatObject = dataManagement.createNewChat(newChat);

      // 3. create a response message with the newly created chatObject
      dataManagement.getUsersInChat(chatObject.chatID).forEach(chatMemberID => {
        // determin the chatMembers socketID
        const thisClient = connectedClients.find(client => client.userID === chatMemberID);

        // if the clients userID is found among the connectedClients, emit this, to add the new chatObject to his viewModel
        if (thisClient !== undefined) {
          io.to(thisClient.socketID).emit("serverSendingNewChat", {
            error: false,
            chat: chatObject,
            creatorID: connectedClients.find(client => client.socketID === socket.id).userID,// even works if the client disconnects, because undefined wouldn't match any clientProfiel.userID
          });
        }
      });
    } catch (err) {
      // give the creator-client an error
      socket.emit("serverSendingNewChat", {
        error: err,
        creatorID: connectedClients.find(client => client.socketID === socket.id).userID
      });
    }
  });

  //listen for a new Message and add it to the specific chats history
  socket.on("clientSendingNewMessage", (message) => {
    // check if the chat is mqtt able
    if (message.chatID === "mqttAble") {
      // check if the message contains 3 or less emojis
      let thisEmojis = Array.from(message.content.toString());
      console.log(thisEmojis);
      let positions = thisEmojis.map(thisEmoji => emojis.lastIndexOf(thisEmoji));
      let areEmojis = true;
      // if so, emit the message to the broker
      if (thisEmojis.length <= 1) {
        if (positions[0] === undefined) areEmojis = false;
      } else if (thisEmojis.length <= 2) {
        if (positions[0] === undefined) areEmojis = false;
        if (positions[1] === undefined) areEmojis = false;
      } else if (thisEmojis.length <= 3) {
        if (positions[0] === undefined) areEmojis = false;
        if (positions[1] === undefined) areEmojis = false;
        if (positions[2] === undefined) areEmojis = false;
      } else {
        areEmojis = false;
      }

      if (areEmojis) {
        mqttConnection.publish(sendingChannel, `${positions[0]},${positions[1]},${positions[2]}`);
        console.log(sendingChannel, `${positions[0]},${positions[1]},${positions[2]}`);
      }
    }
    // 1. determine the sender via the socketID
    // still usefull, because the client cant fake the userID
    message.clientID = connectedClients.find(client => client.socketID === socket.id).userID;

    // 2. create a new Message and add it to the related chat
    // 2. in the same step get the message back, but updated (with a timeStamp e.g.)
    let resMessage = dataManagement.addMessageToChat(message);

    // 3. send an update to all online chatMembers
    dataManagement.getUsersInChat(message.chatID).forEach(chatMemberID => {
      // if the clients userID is found among the connectedClients, emit this, to add this new message to his history
      for (let x = 0; x < connectedClients.length; x++) {
        if (connectedClients[x].userID === chatMemberID) {
          io.to(connectedClients[x].socketID).emit("serverSendingNewMessage", resMessage);
          break;
        }
      }
    });

    dataManagement.saveState();
  });

  // when a client disconnects
  socket.on("disconnect", () => {
    // 1. search for the disconnected socked.id in the currently connectedClients
    for (let x = 0; x < connectedClients.length; x++) {
      if (connectedClients[x].socketID === socket.id) {
        // if the id is found remove its entry from the array
        connectedClients.splice(x, 1);
        break;
      }
    }
  });
});

mqttConnection.on('connect', function () {
  // add a listener for messages coming through the receiving Channel
  mqttConnection.subscribe(receivingChannel);
  console.log("connected to mqtt");
});

// when a message is coming in
mqttConnection.on('message', (topic, message) => {
  // 1. check the topic and then do Stuff
  if (topic.includes(receivingChannel) || topic.includes(sendingChannel)) {
    console.log("received: " + message);
    let msgObject = {
      chatID: "mqttAble",
      content: message.toString().split(",").map(pos => emojis[pos]).toString(),
      messageType: "textMessage",
      clientID: dataManagement.getUserID("Michi"),
    };
    let resMessage = dataManagement.addMessageToChat(msgObject);
    console.log("received: " + msgObject.content);

    // 3. send an update to all online chatMembers
    dataManagement.getUsersInChat(msgObject.chatID).forEach(chatMemberID => {
      // if the clients userID is found among the connectedClients, emit this, to add this new message to his history
      for (let x = 0; x < connectedClients.length; x++) {
        if (connectedClients[x].userID === chatMemberID) {
          io.to(connectedClients[x].socketID).emit("serverSendingNewMessage", resMessage);
          break;
        }
      }
    });
  }

});
