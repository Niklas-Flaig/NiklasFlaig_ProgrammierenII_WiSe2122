let chatApp = new Vue({
  el: "#vue",
  data: {
    // the Mode, were currently in
    currentMode: "logIn",

    // LOGIN / Register STUFF
    userName: "",
    password: "",
    repeatPassword: "",


    // the clients userID
    clientUserID: false,
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
    }
  }
});