// Connction to the WebSocket-Server:
let socket = io("http://127.0.0.1:80");
      
// and listen for the incoming responses
socket.on(`serverReturningProfile`, (res) => {
  // if thers no error
  if (!res.error) {
    // change the mode to chat
    chatApp.changeMode("chat");
    
    chatApp.clientProfile = res.profile;
    // create the Chat-Objects
    chatApp.clientChats = res.chats.map(chat => chatApp.createNewChat(chat));
    
  } else {
    switch (res.error) {
      case 508:
        console.log("error 508: invalid Password");
        break;
      case 509:
        console.log("error 509: profile not found");
        break;
      case 510:
        console.log("error 510: Profile already exists");
        break;
    }
  }
});

socket.on("serverSendingNewChat", (res)=> {
  if (!res.error) {
    chatApp.createNewChat(res.chat);
    
    //! kann das nicht asyncron in die "requestChatGeneration" Funktion???
    // change the mode to chat
    chatApp.changeMode("chat");
    
    // switch the chat
    chatApp.switchChat(res.chat.chatID);

  } else {
    switch (res.error) {
      case 521:
        console.log("error 521: Profile couldn't be found");
        break;
    }
  }
});

socket.on("serverSendingNewContact", (contact) => {
  chatApp.clientProfile.contacts.push(contact);
});
// receive a new Message and add it to the related Chat
socket.on("serverSendingNewMessage", (message) => chatApp.addMessageToChat(message));
