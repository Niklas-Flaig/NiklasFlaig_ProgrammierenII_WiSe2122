let chatApp = new Vue({
  el: "#chat",
  data: {
    // the clients userID
    clientUserID: 01,
    // the own Profile of the client
    clientProfile: {},
    // the chats this user participates in
    clientChats: [],


    currentChatID: 0,
    newMessageText: "",

    chatHistory: "",
  },
  methods: {
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
    addMessageToChat: (message) => {
      // addMessage to the chat wich chatID matches the message.chatID
      this.clientChats.find(chat => chat.getChatID() === message.chatID).addMessage(message);
    }
  }
});