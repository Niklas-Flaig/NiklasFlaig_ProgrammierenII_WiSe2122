// a refference on the current UserProfile
const currentProfile = profiles.find(profile => profile.userID === loggedInProfileID);

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
      document.querySelector(`#chatHistory`).innerHTML = chats.find(chat => chat.chatID === currentChatID).writeChatSelectHtml();
    })
  });
}