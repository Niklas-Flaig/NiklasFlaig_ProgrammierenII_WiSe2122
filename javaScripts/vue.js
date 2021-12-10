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
    sendMessage: () => {
      socket.emit("clientSendingNewMessage", this.currentChatID, this.newMessageText);
    },

  }
});