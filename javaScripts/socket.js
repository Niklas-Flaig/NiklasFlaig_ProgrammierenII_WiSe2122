// Connction to the WebSocket-Server:
let socket = io("http://127.0.0.1:80");
      
// and listen for the incoming response
socket.on(`serverResponsesToLogIn`, (res) => {
  // if thers no error
  if (!res.error) {
    chatApp.currentMode = "chat";


    chatApp.clientProfile = res.profile;
    // change the mode to chat
    
    // then get the Chats
    chatApp.clientUserID = res.profile.userID;
    requestChats();
  } else {
    switch (res.error) {
      case 508:
        console.log("error 508: invalid Password");
        break;
      case 509:
        console.log("error 509: profile not found");
        break;
    }
  }
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
            message.content,
            // message.time
          );
      }
    }),
    chat.chatName,
    chat.image
  ));
});

// receive a new Message and add it to the related Chat
socket.on("serverSendingNewMessage", (message) => chatApp.addMessageToChat(message));
