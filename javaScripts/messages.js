generateChatSelection();

let states = {
  currentChat: 0,
}

function generateHistory(chatNO) {
  let historyHtml = ``;

  let temps = {
    messageNumber: 0,
    sendtBy: "",
  };

  // create html
  backup[chatNO].history.forEach(message => {
    temps.messageNumber = "";

    message.time.forEach(timePart => {
      temps.messageNumber += timePart;
    });

    if(message.sender === testProfile.id) {
      temps.sendtBy = "You";
    } else {
      temps.sendtBy = "NotYou";
    };

    historyHtml += `
      <div id="message_${temps.messageNumber}" class="sendtBy_${temps.sendtBy}">
        <span class="${message.type}Message">${message.content}</span>
      </div>
    `;
  });

  // implement html
  document.querySelector("#chatHistory").innerHTML = historyHtml;
}

function generateChatSelection() {
  let chatsHtml = ``;
  let temps = {
    chatName: "",
  };

  //create the html for all chats
  for (let x = 0; x < backup.length; x++) {

    // get the chatName
    if (backup[x].chatType === "singleChat") {
      // the ChatName is the savedName of the contact with the id from this chat, that doesn`t match the users id
      temps.chatName = testProfile.contacts.find(contact => contact.id === backup[x].users.find(id => id !== testProfile.id)).savedName;
    } else if (backup[x].chatType === "groupChat"){
      temps.chatName = backup[x].chatName;
    }

    // generate the html for the current chat
    chatsHtml += `
      <button id="chatID_${x}" class="chatTo">
        <h4 class="userName"> 
          ${temps.chatName}
        </h4>
        <div class="lastMessage" class="sendtBy_You">
          Hi!
        </div>
      </button>
    `;
  };
  
  // implement the html
  document.querySelector("#chatSelectSurface").innerHTML = chatsHtml;

  // add eventListeners to the newly implemented html elements
  for (let x = 0; x < backup.length; x++) {
    if (backup[x].users.find(userID => userID === testProfile.id)) {
      document.querySelector(`#chatID_${x}`).addEventListener("click", function () {
        // render the history of the selected chat
        generateHistory(x);
        // change the states.currentChat to the position of this chat in the backup array (x)
        states.currentChat = x;
      });
    }
  }
}

function addToHistory(chatID, message) {
  let tempMessage = new Message();
  
  // create the message-object, that will be added to the backup //! just in the memory, won´t write any data
  tempMessage.time =
  
  backup[x].history.push();
}

