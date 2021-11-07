/* In this file all the classes used in the Project will be defined */

// Message classes
class Message {
  constructor(senderID, time, messageID, text) {
    this.senderID = senderID;
    this.time = time;
    this.messageID = messageID;
    this.text = text;
  }

  getText() {
    //! what if image/data???
    return this.text;
  }
  getSenderName() {
    if(this.senderID === profile.userID) {
      return "You: ";
    } else {
      return profile.getContactSavedName(senderID) + ": ";
    };
  }
}

class TextMessage extends Message {
  constructor(senderID, time, messageID, text) {
    super(senderID, time, messageID, text);
  }

  writeHtml() {
    let sendtBy = "";
    
    if(senderID === profile.userID) {
      sendtBy = "You";
    } else {
      sendtBy = "NotYou";
    };
    
    return `
    <div id="message_${this.messageID}" class="sendtBy_${sendtBy}">
      <span class="textMessage">${this.text}</span>
    </div>
    `;
  }
}

class FileMessage extends Message {
  constructor(senderID, time, messageID, text, fileName) {
    super(senderID, time, messageID, text);
    this.fileName = fileName;
  }

  writeHtml() {
    let sendtBy = "";
    
    if(senderID === profile.userID) {
      sendtBy = "You";
    } else {
      sendtBy = "NotYou";
    };

    //! still stuff todo
    return `
    <div id="message_${this.messageID}" class="sendtBy_${sendtBy}">
      <div><a href="${"/* download Path */" + this.fileName}">${this.fileName}</a></div>
      <span class="textMessage">${this.text}</span>
    </div>
    `;
  }
}

class ImageMessage extends FileMessage {
  constructor(senderID, time, messageID, text, fileName) {
    super(senderID, time, messageID, text, fileName);
  }

  writeHtml() {
    let sendtBy = "";
    
    if(senderID === profile.userID) {
      sendtBy = "You";
    } else {
      sendtBy = "NotYou";
    };
    
    //! still stuff todo
    return `
    <div id="message_${this.messageID}" class="sendtBy_${sendtBy}">
      <div><img href="${"/* image Path */" + this.fileName}></img></div>
      <span class="textMessage">${this.text}</span>
    </div>
    `;
  }
}


// chat classes
class Chat {
  constructor(chatID, users, history) {
    this.chatID = chatID;
    this.users = users;
    this.history = history;
  }

  addToHistory(message) {
    this.history.push(message);
  }
  writeHistoryHtml() {
    let html = "";
    this.history.forEach(message => html += message.writeHtml())
    return html;
  }
  writeHeaderHtml() {
    return ``
    //! still stuff todo
  }
  writeChatSelectHtml() {
    return `
      <button id="${this.chatID}" class="chatTo">
        <h4 class="chatName"> 
          ${this.getChatName()}
        </h4>
        ${this.lastMessageHtml()}
        <div class="lastMessage" class="sendtBy_You">
          inhalt
        </div>
      </button>
    `;
  }
}

class GroupChat extends Chat {
  constructor(chatID, users, history, groupName, groupPicPath) {
    super(chatID, users, history);
    this.groupName = groupName;
    this.groupPicPath = groupPicPath;
  }
  
  leaveGroup(userID) {
    // deletes userID from the "users" array
    this.users.splice(this.users.findIndex(userID), 1)
  }
  joinGroup(userID) {
    // adds this userID to the "users" array
    this.users.push(userID);
  }
  
  writeLastMessageHtml() {
    return `
      <div class="lastMessage">
        <span class="senderName">${this.history[history.length-1].getSenderName()}</span>
        <span class="message">${this.history[history.length-1].getText()}</span>
      </div>
    `
  }
  
  getChatName() {
    return this.groupName
  }

  setGroupName(name) {
    this.groupName = name;
  }

}

class PToPChat extends Chat {
  constructor(chatID, users, history) {
    super(chatID, users, history);
  }
  writeLastMessageHtml() {
    return `
      <div class="lastMessage">
        <span class="message">${this.history[history.length-1].getText()}</span>
      </div>
    `
  }
  getChatName() {
    return this.history[history.length-1].getSenderName();
  }
}


// other classes
class Profile {
  constructor(userID, myName, password, status, contacts, chats, profilePicFileName) {
    this.userID = userID;
    this.myName = myName;
    this.password = password;
    this.status = status;
    this.contacts = contacts;
    this.chats = chats;
    this.profilePicFileName = profilePicFileName;
  }
  getContactSavedName(givenID) {
    // gets the savedName of the first contact with the "givenID"
    return this.contacts.find(contact => contact.getUserId === givenID).getSavedName();
  }
}

class Contact {
  constructor(userID, savedName) {
    this.userID = userID;
    this.savedName = savedName;
  }
  
  getSavedName() {
    return this.savedName;
  }
  setSavedName(newName) {
    this.savedName = newName;
  }

  getUserId() {
    return this.userID;
  }
}