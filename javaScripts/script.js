document.querySelector("#sendMessage_Button").addEventListener("click", function () {
  // get the written Text
  const messageText = document.querySelector("#textMessage_TextInput").value;
  // add a new TextMessage to the current Chats history
  chats.find(chat => chat.chatID === selectedChatID).addToHistory(new TextMessage(loggedInProfileID, messageText));
  // re-render the chatHistory and clear the input field
  document.querySelector(`#chatHistory`).innerHTML = chats.find(chat => chat.chatID === selectedChatID).writeHistoryHtml();
  document.querySelector("#textMessage_TextInput").value = "";
})
document.querySelector("#textMessage_TextInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    // get the written Text
    const messageText = document.querySelector("#textMessage_TextInput").value;
    // add a new TextMessage to the current Chats history
    chats.find(chat => chat.chatID === selectedChatID).addToHistory(new TextMessage(loggedInProfileID, messageText));
    // re-render the chatHistory and clear the input field
    document.querySelector(`#chatHistory`).innerHTML = chats.find(chat => chat.chatID === selectedChatID).writeHistoryHtml();
    document.querySelector("#textMessage_TextInput").value = "";
  }
});


// a refference on the current UserProfile
const currentProfile = profiles.find(profile => profile.userID === loggedInProfileID);

// the chatId, of th ecurrently opened chat
let selectedChatID = 0;

console.log(currentProfile);




new Vue({
  el: "#chat",
  data: {
    currentChatID: 0,

    chatHistory: "",
    // just the chats that affect this user
    thisChats: chats.filter(chat => chat.chatID === currentProfile.chatIDs.find(tempChatID => tempChatID === chat.chatID)),
  },
  methods: {
    switchChat: function (thisChatID) {
      this.chatHistory = this.thisChats.find(chat => chat.chatID === thisChatID).getHistory();
      this.currentChatID = thisChatID;
    },
    addMessageToHistory: function (currentHistory) {

    }
  }
})