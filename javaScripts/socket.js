// Connction to the WebSocket-Server:
let socket = io("http://127.0.0.1:80");
      
// and listen for the incoming response
socket.on(`serverReturningClientsProfile`, (profile) => {
  //? encapsulation?
  chatApp.clientProfile = profile;
});

// will write the incoming Chats into the clientChats array in the VUE
socket.on(`requestedChatsForUser`, (incomingChats) => {
  chatApp.clientChats = incomingChats.map(chat => new Chat(
    chat.chatID,
    chat.users,
    chat.history.map(message => { // create a new object of a Message-class child-class
      // determine what type of message this is
      switch (message.messageType) {
        case "textMessage":
          return new TextMessage(
            message.senderID,
            message.content
          );
      }
    }),
    chat.chatName,
    chat.image
  ));
});


// request functions

// will emit a request for the profile of the current client
function requestOwnProfile() {
  socket.emit("clientRequestingOwnProfile", chatApp.clientUserID);
}
// will send a request for all the chats the current user participates in
function requestChats() {
  socket.emit("requestingChats", chatApp.clientUserID);
}



// setup the data
requestOwnProfile();
requestChats();