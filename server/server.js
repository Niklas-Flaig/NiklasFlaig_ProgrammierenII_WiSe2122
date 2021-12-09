// Modules
// Create a http-server with a request listener 
var app = require('http').createServer(handler);
// Create a socket.io instance and bind it to the http-server
var io = require('socket.io')(app);
const { sign } = require('crypto');
// To access the file system
var fs = require('fs');
// to interact with the required data
var dataManagement = require("./dataManagement");

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
  });
  
  // listen for a request of all chats a user participates in
  socket.on("requestingChats", (userID) => {
    // get and emit the requested chats
    socket.emit(`requestedChatsForUser`, dataManagement.getChatsWithUser(userID));
  });
});
