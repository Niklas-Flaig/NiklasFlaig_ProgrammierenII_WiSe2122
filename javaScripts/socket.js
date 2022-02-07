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
    res.chats.forEach(chat => chatApp.createNewChat(chat));
    
  } else {
    switch (res.error) {
      case 508:
        chatApp.passwordErr = "Invalid Password!";
        console.log("error 508: invalid Password");
        break;
      case 509:
        chatApp.userNameErr = "This Profile doesn't exist!";
        console.log("error 509: profile not found");
        break;
      case 510:
        chatApp.userNameErr = "This Profile already exists!";
        console.log("error 510: Profile already exists");
        break;
    }
  }
});

socket.on("serverSendingNewChat", (res) => {
  if (!res.error) {
    chatApp.createNewChat(res.chat);


    // change the mode to chat
    chatApp.changeMode("chat");
    
    // switch the chat
    chatApp.switchChat(res.chat.chatID);

  } else {
    switch (res.error) {
      case 521:
        chatApp.newGroupChat.userNamesErr = "A requested Profile doesn't exist!";
        chatApp.newChat.userNameErr = "The requested Profile doesn't exist!";
        console.log("error 521: Profile not found");
        break;
      case 522:
        chatApp.newGroupChat.userNamesErr = "You can't create a group with yourself!";
        console.log("error 522: No u!");
        break;
    }
  }
});

socket.on("serverSendingNewContact", (contacts) => contacts.forEach(contact => chatApp.clientProfile.contacts.push(contact)));

// receive a new Message and add it to the related Chat
socket.on("serverSendingNewMessage", (message) => chatApp.addMessageToChat(message));
