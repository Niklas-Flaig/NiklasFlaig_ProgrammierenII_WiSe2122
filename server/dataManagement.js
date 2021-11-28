// makes the functions available in form of a module (https://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files)
module.exports = {
  // will return all Chats, in wich this User participates
  getRequestedChatsForUser: function (userIDFromRequest) {
    let chatsForUser = [];
    
    // filters the chats with the users ID (userIDFromRequest) as a member
    chatsForUser = dataStructure_Chats.filter(chat => chat.users.find(userIDInThisChat => userIDInThisChat === userIDFromRequest) === userIDFromRequest);
    console.log(chatsForUser);
    
    // returns the requested chats in form of an array
    return chatsForUser;
  },
};


// also need the classes to be able to create instances of them 
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
    }
  }
  getSender() {
    let sendtBy = "";
    
    if (this.senderID === loggedInProfileID) {
      sendtBy = "sendtBy_You";
    } else {
      sendtBy = "sendtBy_NotYou";
    }

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
    this.users.splice(this.users.findIndex(userID), 1);
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

/* end of the classes*/


// temporarily test-data will be stored in this file, until I learn about a better way
// the data structure to save all data, used in the Project
let profiles = [];
let dataStructure_Chats = [];

// filling the structure with testData

// create new Profiles
profiles = [
  new Profile(01, "Niklas Flaig", 1234),
  new Profile(02, "Peter Obama", 4321),
  new Profile(03, "Katherine", 0000),
];

// add contacts to profiles
//? sinnvoller den Contact in der methode zu kreieren?
profiles[0].addContact(new Contact(02, "Pete"));
profiles[0].addContact(new Contact(03, "Kat"));

profiles[1].addContact(new Contact(01, "Nikl"));
profiles[1].addContact(new Contact(03, "Kat"));

profiles[2].addContact(new Contact(01, "Niklas"));
profiles[2].addContact(new Contact(02, "Peter O."));

// create new chats
dataStructure_Chats = [
  new PToPChat(01, [01, 02]),
  new PToPChat(02, [01, 03]),
  new GroupChat(03, [01, 02, 03], "PizzaGroup"),
];

dataStructure_Chats[0].addToHistory(new TextMessage(01, "Pizza?"));
dataStructure_Chats[0].addToHistory(new TextMessage(02, "Ok"));
dataStructure_Chats[0].addToHistory(new TextMessage(01, "C u 10!"));


dataStructure_Chats[1].addToHistory(new TextMessage(03, "Hello?"));
dataStructure_Chats[1].addToHistory(new TextMessage(01, "New Phone hu dis?"));


dataStructure_Chats[2].addToHistory(new TextMessage(03, "Hi!"));
dataStructure_Chats[2].addToHistory(new TextMessage(01, "Nice Group!"));
dataStructure_Chats[2].addToHistory(new TextMessage(02, "Why spam?"));


// add chats to Profiles 
// mainly so we don't have to search the chats with the userID in it
profiles[0].addChat(01);
profiles[0].addChat(02);
profiles[0].addChat(03);

profiles[1].addChat(01);
profiles[1].addChat(03);

profiles[2].addChat(02);
profiles[2].addChat(03);

let loggedInProfileID = 01;