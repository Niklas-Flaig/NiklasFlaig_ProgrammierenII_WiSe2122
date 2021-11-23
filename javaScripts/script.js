// a refference on the current UserProfile
const currentProfile = profiles.find(profile => profile.userID === loggedInProfileID);

console.log(currentProfile);




new Vue({
  el: "#chat",
  data: {
    currentChatID: 0,
    newMessageText: "",

    chatHistory: "",
    // just the chats that affect this user
    thisChats: chats.filter(chat => chat.chatID === currentProfile.chatIDs.find(tempChatID => tempChatID === chat.chatID)),
  },
  methods: {
    switchChat: function (thisChatID) {
      this.chatHistory = this.thisChats.find(chat => chat.chatID === thisChatID).getHistory();
      this.currentChatID = thisChatID;
    },
    addMessageToHistory: function () {
      this.thisChats.find(chat => chat.chatID === this.currentChatID).addToHistory(new TextMessage(loggedInProfileID, this.newMessageText));
      this.newMessageText = "";
    }
  }
})