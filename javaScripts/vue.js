let chatApp = new Vue({
  el: "#chat",
  data: {
    // LOGIN STUFF
    userName: "",
    password: "",


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
        userName: logiInApp.userName,
        password: logiInApp.password,
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
    }
  }
});