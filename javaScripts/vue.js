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
      userNameErr: "",
    },
    newGroupChat: {
      name: "",
      nameErr: "",
      userNames: "",
      userNamesErr: ""
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
      if (chatApp.password !== chatApp.repeatPassword) { // check if the password matches the repeat
        err = true;
        chatApp.repeatPasswordErr = "The passwords have to match!";
      } else {
        chatApp.repeatPasswordErr = "";
      }

      // emit an object with the userName and password
      if (err === false) socket.emit("clientTrysToRegister", {
        userName: this.userName,
        password: this.password,
      });
    },
    requestChatGeneration: function (chatType) {
      let err = false;

      
      switch (chatType) {
        case "pToPChat":
          if (chatApp.newChat.userName === "") {
            chatApp.newChat.userNameErr = "Enter a Name!";
            err = true;
          } else {
            chatApp.newChat.userNameErr = "";
          }
          break;
        case "groupChat":
          if (chatApp.newGroupChat.name === "") {
            chatApp.newGroupChat.nameErr = "Enter a Chatname!";
            err = true;
          } else {
            chatApp.newGroupChat.nameErr = "";
          }

          if (chatApp.newGroupChat.userNames === "") {
            chatApp.newGroupChat.userNamesErr = "Enter at least one Username!";
            err = true;
          } else {
            chatApp.newGroupChat.userNamesErr = "";
          }
          break;
      }

      let newChatElement = {
        chatType: chatType,
      };

      if (!err) {
        switch (chatType) {
          case "pToPChat":
            // in a pToPChat you may not have the other Person as a contact, so you have to acces the Person with it's unique userName
            // the other users unique userName
            newChatElement.users = [chatApp.clientProfile.userName, chatApp.newChat.userName];
            break;
          case "groupChat":
            // the other users userNames
            newChatElement.users = chatApp.newGroupChat.userNames.split(", ");
            newChatElement.users.push(chatApp.clientProfile.userName);
            newChatElement.groupName = chatApp.newGroupChat.name;
            chatApp.newGroupChat.nameErr = "";
            chatApp.newGroupChat.userNamesErr = "";
            console.log(newChatElement.users);
            break;
        }

        socket.emit("clientCreatingNewChat", newChatElement);
      }
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
      if (this.newMessageText !== "") {
        socket.emit("clientSendingNewMessage", {
          chatID: this.currentChat.chatID,
          content: this.newMessageText,
          messageType: "textMessage"
        });
        chatApp.newMessageText = "";
      }
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