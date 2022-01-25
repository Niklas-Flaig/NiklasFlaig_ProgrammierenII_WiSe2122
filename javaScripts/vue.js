let chatApp = new Vue({
  el: "#vue",
  data: {
    // the Mode, were currently in
    currentMode: "logIn",

    // LOGIN / Register STUFF
    userName: "",
    userNameErr: "",

    password: "",
    passwordErr: "",
    
    repeatPassword: "",
    repeatPasswordErr: "",

    // newChat STUFF;
    newChat: {
      userName: "",
    },
    newGroupChat: {
      name: "",
      userNames: ""
    },


    // the own Profile of the client
    clientProfile: {},
    // the chats this user participates in
    clientChats: [],


    currentChat: {
      chatID: 0,
      history: [],
      chatType: "",
    },

    newMessageText: "",

  },
  methods: {
    submitLogin: function () {
      let err = false;
      
      // errorChecks
      if (chatApp.userName === "") { // check if the UserName is empty
        err = true;
        chatApp.userNameErr = "You have to enter a UserName!";
      } else {
        chatApp.userNameErr = "";
      }
      if (chatApp.password === "") { //check if the password is empty
        err = true;
        chatApp.passwordErr = "You have to enter a password!";
      } else {
        chatApp.passwordErr = "";
      }

      // emit an object with the userName and password
      if (err === false) socket.emit("clientTrysToLogIn", {
        userName: this.userName,
        password: this.password,
      });
    },
    submitRegister: function () {
      // emit an object with the userName and password
      socket.emit("clientTrysToRegister", {
        userName: this.userName,
        password: this.password,
      });
    },
    requestChatGeneration: function (chatType) {
      let newChat = {
        chatType: chatType,
      };

      // in a pToPChat you may not have the other Person as a contact, so you have to acces the Person with it's unique userName
      if (chatType === "pToPChat") {
        // the other users unique userName
        newChat.users = [chatApp.clientProfile.userName, chatApp.newChat.userName];
        console.log(newChat.users);
      } else if (chatType === "groupChat") {
        // the other users userNames
        newChat.users = [chatApp.clientProfile.userName];
        newChat.users.concat(chatApp.newGroupChat.userNames.split(", "));
        newChat.groupName = chatApp.newGroupChat.name;
      }

      console.log(newChat);
      socket.emit("clientCreatingNewChat", newChat);
    },
    createNewChat: function (chat) {
      // add the new Chat to the vue
      switch (chat.chatType) {
        case "pToPChat":
          this.clientChats.push(new PToPChat(
            chat.chatID,
            chat.users,
            chat.history,
            chat.image
          ));
          break;
        case "groupChat":
          this.clientChats.push(new GroupChat(
            chat.chatID,
            chat.users,
            chat.history,
            chat.chatName,
            chat.image
          ));
          break;
      }
    },
    switchChat: function (thisChatID) {
      const thisChat = this.clientChats.find(chat => chat.chatID === thisChatID);
      this.currentChat.chatID = thisChatID;
      this.currentChat.history = thisChat.getHistory();
      this.currentChat.chatType = thisChat.getChatType();
    },
    sendMessage: function () { // why not () => {}
      socket.emit("clientSendingNewMessage", {
        chatID: this.currentChat.chatID,
        content: this.newMessageText,
        messageType: "textMessage"
      });
      chatApp.newMessageText = "";
    },
    addMessageToChat: function (message) {
      // addMessage to the chat wich chatID matches the message.chatID
      this.clientChats.find(chat => chat.getChatID() === message.chatID).addMessage(message);
    },
    changeMode: function (newMode) {
      this.currentMode = newMode;
    },

    submitNiklasFlaigLogin: function () { //! temporary
      socket.emit("clientTrysToLogIn", {
        userName: "Niklas Flaig",
        password: "1234",
      });
    },
  }
});