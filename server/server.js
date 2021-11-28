// Modules
// Create a http-server with a request listener 
var app = require('http').createServer(handler);
// Create a socket.io instance and bind it to the http-server
var io = require('socket.io')(app);
// To access the file system
var fs = require('fs');
// to interact with the required data
var dataManagement = require("./dataManagement");

// Make the http-server listen on port 80
app.listen(80);
console.log( "Webserver is listening on Port 80" );

// Serving the site - create a http-response
function handler (req, res) {
  fs.readFile(__dirname + '/../index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}


// listens for a new connection
io.on('connection', function (socket) {
  // listen for a request of all chats a user participates in
  socket.on("requestingChats", function (userID) {
    // get and emit the requested chats
    socket.emit(`requestedChatsForUser${userID}`, dataManagement.getRequestedChatsForUser(userID));
  });
});
