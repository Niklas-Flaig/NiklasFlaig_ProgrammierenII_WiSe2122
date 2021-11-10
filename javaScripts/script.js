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
renderChatSelection();


// Will render the ChatSelection in the sidebar
function renderChatSelection() {
  let chatSelectionHtml = ``;
  // for each chat with a Id, matching a ID from the profiles chat-array, execute .writeChatSelectHtml
  currentProfile.chatIDs.forEach(currentChatID => {
    chatSelectionHtml += chats.find(chat => chat.chatID === currentChatID).writeChatSelectHtml()
  });
  document.querySelector("#chatSelectSurface").innerHTML = chatSelectionHtml;

  // adds an el to every created button
  currentProfile.chatIDs.forEach(currentChatID => {
    console.log(currentChatID);
    document.querySelector(`#chatID_${currentChatID}`).addEventListener("click", function () {
      // print the history into the html
      document.querySelector(`#chatHistory`).innerHTML = chats.find(chat => chat.chatID === currentChatID).writeHistoryHtml();
      selectedChatID = currentChatID;
    })
  });
}


new Vue({
  el: "#chat",
  data: {
    chatHistory: "",

  },
  methods: {
    renderHistory: function (thisChatID) {
      chatHistory = chats.find(chat => chat.chatID === thisChatID).writeHistoryHtml();
    },
  }
})