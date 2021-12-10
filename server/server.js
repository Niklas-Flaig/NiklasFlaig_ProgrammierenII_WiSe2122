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

  // listen for a request of a clients own userProfile
  socket.on("clientRequestingOwnProfile", (clientsUserID) => {
    // get and emit the requested profile
    socket.emit(`serverReturningClientsProfile`, dataManagement.getProfile(clientsUserID));
    // now, that the client has his profile, we can make a new note in this Server
    connectedClients.push({
      socketID: socket.id,
      userID: clientsUserID
    });
  });
  
  // listen for a request of all chats a user participates in
  socket.on("requestingChats", (userID) => {
    // get and emit the requested chats
    socket.emit(`requestedChatsForUser`, dataManagement.getChatsWithUser(userID));
  });

  //listen for a new Message and add it to the specific chats history
  socket.on("clientSendingNewMessage", (message) => {
    // 1. determine the sender via the socketID
    // still usefull, because the client cant fake the userID
    message.clientID = connectedClients.find(client => client.socketID === socket.id).clientsUserID;

    // 2. create a new Message and add it to the related chat
    dataManagement.addMessageToChat(message);

    // 3. send an update to all online chatMembers
    dataManagement.getUsersInChat(message.chatID).forEach(chatMemberID => {
      // if the clients userID is found among the connectedClients, emit this, to add this new message to his history
      const thisMembersSocketID = connectedClients.find(client => client.userID === chatMemberID);
      io.to(thisMembersSocketID).emit("serverSendingNewMessage", message);
    });
  });
});


//* Probably its intelligent to just store the currently used Chats(with online users) in the servers Memory and leave the rest on the drive?