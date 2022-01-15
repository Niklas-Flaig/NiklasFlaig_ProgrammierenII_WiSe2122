let chatApp = new Vue({
  el: "#vue",
  data: {
    // the Mode, were currently in
    currentMode: "logIn",

    // LOGIN / Register STUFF
    userName: "",
    password: "",
    repeatPassword: "",

    // newChat STUFF;
    newChat: {
      userName: "",
    },
    newGroupChat: {
      Name: "",
      newUser: "",
      users: [],
    },


    // the own Profile of the client
    clientProfile: {},
    // the chats this user participates in
    clientChats: [],


    currentChatID: 0,
    newMessageText: "",

    chatHistory: [],
  },
  methods: {
    submitLogin: function () {
      // emit an object with the userName and password
      socket.emit("clientTrysToLogIn", {
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
        newChat.users = chatApp.newGroupChat.users;
        //TODO add groupPic, description etc...
      }

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
      this.chatHistory = this.clientChats.find(chat => chat.chatID === thisChatID).getHistory();
      this.currentChatID = thisChatID;
    },
    sendMessage: function () { // why not () => {}
      socket.emit("clientSendingNewMessage", {
        chatID: this.currentChatID,
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