// Connction to the WebSocket-Server:
let socket = io("http://127.0.0.1:80");
      
// and listen for the incoming response
socket.on(`serverResponsesToLogIn`, (res) => {
  // if thers no error
  if (!res.error) {
    // change the mode to chat
    chatApp.currentMode = "chat";
    
    chatApp.clientProfile = res.profile;
    
    chatApp.clientUserID = res.profile.userID;
    
    
    // then get the Chats
    chatApp.clientChats = res.chats.map(chat => new Chat(
      chat.chatID,
      chat.users,
      chat.history.map(message => { // create a new object of a Message-class child-class
        // determine what type of message this is
        switch (message.messageType) {
          case "textMessage":
            return new TextMessage(
              message.senderID,
              message.content,
              message.time
            );
        }
      }),
      chat.chatName,
      chat.image
    ));
    
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

// receive a new Message and add it to the related Chat
socket.on("serverSendingNewMessage", (message) => chatApp.addMessageToChat(message));
