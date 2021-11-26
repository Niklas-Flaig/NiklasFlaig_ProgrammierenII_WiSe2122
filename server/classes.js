/* In this file all the classes used in the Project will be defined */

// Message classes
class Message {
  constructor(senderID, text) { //! time und messageID automatisch generieren
    this.senderID = senderID;
    this.text = text;
    this.time;
    this.messageID;
  }

  getText() {
    //! what if image/data???
    return this.text;
  }
  getSenderName() {
    if(this.senderID === currentProfile.userID) {
      return "You: ";
    } else {
      return currentProfile.getContactSavedName(this.senderID) + ": ";
    };
  }
  getSender() {
    let sendtBy = "";
    
    if(this.senderID === loggedInProfileID) {
      sendtBy = "sendtBy_You";
    } else {
      sendtBy = "sendtBy_NotYou";
    };

    return sendtBy;
  }
}

class TextMessage extends Message {
  constructor(senderID, text) {
    super(senderID, text);
  }

  getContent() {
    return this.text;
  }
}

class FileMessage extends Message {
  constructor(senderID, text, fileName) {
    super(senderID, text);
    this.fileName = fileName;
  }

  getText() {
    return this.fileName;
  }

  getContent() {
    //TODO ...
  }
}

class ImageMessage extends FileMessage {
  constructor(senderID, text, fileName) {
    super(senderID, text, fileName);
  }

  getText() {
    return this.fileName;
  }
  
  getContent() {
    //TODO ...
  }
}


// chat classes
class Chat {
  constructor(chatID, users) {
    this.chatID = chatID;
    this.users = users;
    this.history = [];
  }

  addToHistory(message) {
    this.history.push(message);
  }
  getHistory() {
    return this.history;
  }
  getLastMessageText() {
    return this.history.at(-1).getText();
  }
}

class GroupChat extends Chat {
  constructor(chatID, users, groupName) {
    super(chatID, users);
    this.groupName = groupName;
    this.groupPicPath;
  }
  
  leaveGroup(userID) {
    // deletes userID from the "users" array
    this.users.splice(this.users.findIndex(userID), 1)
  }
  joinGroup(userID) {
    // adds this userID to the "users" array
    this.users.push(userID);
  }
  getChatName() {
    return this.groupName;
  }

  setGroupName(name) {
    this.groupName = name;
  }
  setGroupPicPath(newPath) {
    this.groupPicPath = newPath;
  }

}

class PToPChat extends Chat {
  constructor(chatID, users) {
    super(chatID, users);
  }
  getChatName() {
    return this.history[history.length-1].getSenderName();
  }
}


// other classes
class Profile {
  constructor(userID, myName, password) {
    this.userID = userID;
    this.myName = myName;
    this.password = password;
    this.status = "";
    this.contacts = [];
    this.chatIDs = [];
    this.profilePicFileName = "";
  }
  getContactSavedName(givenID) {
    // gets the savedName of the first contact with the "givenID"
    return this.contacts.find(contact => contact.getUserId() === givenID).getSavedName();
  }

  setStatus(newStatus) {
    this.status = newStatus;
  }
  addContact(newContact) {
    this.contacts.push(newContact);
  }
  addChat(newChatID) {
    this.chatIDs.push(newChatID);
  }
  setProfilePicFileName(newProfilePicFileName) {
    this.profilePicFileName = newProfilePicFileName;
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
  getUserId() {
    return this.userID;
  }
  
  setSavedName(newName) {
    this.savedName = newName;
  }
}