// Modules
// Create a http-server with a request listener 
var app = require('http').createServer(handler);
// Create a socket.io instance and bind it to the http-server
var io = require('socket.io')(app);
// To access the file system
var fs = require('fs');
// to interact with the required data
var dataManagement = require("./dataManagement");

// a variable, the server can store a data pair for all the currently connected clients in
let connectedClients = [];

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
    // 1. determine the creators ID
    const creatorID = connectedClients.find(client => client.socketID === socket.id).userID;

    try {
      // 2. add the senderClient to the chat
      // and get the chats chatID
      const chat = dataManagement.createNewChat(newChat, creatorID);

      // 3. create a response message with the newly created chat
      dataManagement.getUsersInChat(chatID).forEach(chatMemberID => {
        // determin the chatMembers socketID
        const thisClientsSocketID = connectedClients.find(client => client.userID === chatMemberID).socketID;

        // if the clients userID is found among the connectedClients, emit this, to add the new chat to his viewModel
        if (thisClientsSocketID !== undefined) io.to(thisClientsSocketID).emit("serverSendingNewChat", {
          error: false,
          chat: chat
        });
      });
    } catch (err) {
      // give the creator-client an error
      socket.emit("serverSendingNewChat", {error: err});
    }
  });

  //listen for a new Message and add it to the specific chats history
  socket.on("clientSendingNewMessage", (message) => {
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


//* Probably its intelligent to just store the currently used Chats(with online users) in the servers Memory and leave the rest on the drive?