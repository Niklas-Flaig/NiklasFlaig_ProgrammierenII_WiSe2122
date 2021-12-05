// makes the functions available in form of a module (https://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files)
module.exports = {
  // will return all Chats, in wich a User participates
  getChatsWithUser: function (participantsUserID) {
    // filters the chats with the users ID (participantsUserID) as a participant
    let relevantChats = dataStructure_Chats.filter(chat => chat.getUsers().find(userIDInThisChat => userIDInThisChat === participantsUserID) === participantsUserID);
    
    // create array of Objects that can be used on client side to create new Chat instances
    let output = [];

    relevantChats.forEach(chat => {
      let chatObject = {
        chatID: chat.getChatID(),
        users: chat.getUsers(),
        history: chat.getHistory(),
        chatName: chat.getChatName(),
        image: chat.getImage(),
      };
      // repair the chatName and image: just take the name and Pic of the first User thats not the requester
      if (chatObject.chatName === null) {
        // take the other users name, saved to the profile of the requesters Profile
        chatObject.chatName = dataStructure_Profiles.find(profile => profile.getUserID() === participantsUserID).getContactSavedName(chatObject.users.find(userID => userID !== participantsUserID));
      }

      if (chatObject.image === null) {
        // take the profile pic of the first user, in this chat who isn't the requester
        chatObject.image = dataStructure_Profiles.find(profile => profile.getUserID() !== participantsUserID).getProfilePic();
      }

      output.push(chatObject);
    });
  },
  // will return the profile with the given userID
  getProfile: function (profilesUserID) {
    return dataStructure_Profiles.find(profile => profile.getUserID() === profilesUserID);
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
    this.chatName = "";
    this.image;
  }

  addToHistory(message) {
    this.history.push(message);
  }
  // getters
  getChatID() {return this.chatID;}
  getUsers() {return this.users;}
  getHistory() {return this.history;}
  getChatName() {return this.chatName;}
  getImage() {return this.image;}
  // getLastMessageText() {
  //   return this.history.at(-1).getText();
  // }
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
  // getters
  getChatName() {return null;}
  getImage() {return null;}

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
  getUserID() {
    return this.userID;
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
let dataStructure_Profiles = [];
let dataStructure_Chats = [];

// filling the structure with testData

// create new Profiles
dataStructure_Profiles = [
  new Profile(01, "Niklas Flaig", 1234),
  new Profile(02, "Peter Obama", 4321),
  new Profile(03, "Katherine", 0000),
];

// add contacts to profiles
//? sinnvoller den Contact in der methode zu kreieren?
dataStructure_Profiles[0].addContact(new Contact(02, "Pete"));
dataStructure_Profiles[0].addContact(new Contact(03, "Kat"));

dataStructure_Profiles[1].addContact(new Contact(01, "Nikl"));
dataStructure_Profiles[1].addContact(new Contact(03, "Kat"));

dataStructure_Profiles[2].addContact(new Contact(01, "Niklas"));
dataStructure_Profiles[2].addContact(new Contact(02, "Peter O."));

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
dataStructure_Profiles[0].addChat(01);
dataStructure_Profiles[0].addChat(02);
dataStructure_Profiles[0].addChat(03);

dataStructure_Profiles[1].addChat(01);
dataStructure_Profiles[1].addChat(03);

dataStructure_Profiles[2].addChat(02);
dataStructure_Profiles[2].addChat(03);

let loggedInProfileID = 01;