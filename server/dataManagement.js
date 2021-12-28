var fs = require('fs');
var crypto = require('crypto');

// makes the functions available in form of a module (https://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files)
module.exports = {
  checkLogin: (clientData) => {
    // check if userName is part of a Profile in dataStructure.profiles
    const profile = dataStructure.profiles.find(profile => profile.getUserName() === clientData.userName);
    if (profile !== undefined) {
      // check if the given Password is correct
      if (profile.checkPassword(clientData.password)) { // the password is correct
        // create a profile object for the client
        return createResponse.forProfile(profile);
      } else {
        err = 508; // invalid Password
        throw err;
      }

    } else {
      err = 509; // profile not found
      throw err;
    }

  },
  createNewAccount: (clientData) => {
    // 1. check if the name is already in use
    if (dataStructure.profiles.includes(profile => profile.userName === clientData.userName)) {
      err = 510; // profile already exists
      throw err;
    } else {
      // 2. add a new Profile to the dataStructure.profiles array
      dataStructure.profiles.push(new Profile(
        clientData.userName,
        clientData.password
      ));

      // 3. get the newly created profile
      const profile = dataStructure.profiles.find(profile => profile.getUserName() === clientData.userName);
      
      // 4. create a profile object for the client
      return createResponse.forProfile(profile);
    }
  },
  // will return all Chats, in wich a User participates
  getChatsWithUser: function (participantsUserID) {
    // filters the chats with the users ID (participantsUserID) as a participant
    let relevantChats = dataStructure.chats.filter(chat => chat.getUsers().find(userIDInThisChat => userIDInThisChat === participantsUserID) === participantsUserID);
    
    // create array of Objects that can be used on client side to create new Chat instances
    return relevantChats.map(chat => {
      // type-independent values
      let chatObject = {
        chatID: chat.getChatID(),
        users: chat.getUsers(), //? needed?
        history: chat.getHistory(),//TODO think about encapsulation!!!
        image: chat.getImage(),
      };
      
      // type-dependent values
      switch (chat.chatType) {
        case "groupChat":
          chatObject.chatName = chat.getGroupName();
          break;
        case "pToPchat":
          // take the other users name, saved to the profile of the requesters Profile
          let otherUsersID = chat.getUsers().find(userID => userID !== participantsUserID);
          chatObject.chatName = dataStructure.profiles.find(profile => profile.getUserID() === participantsUserID).getContactSavedName(otherUsersID);
          break;
      }
      
      return chatObject;
    });
  },
  // will create a new Message and add it to a specific chat
  addMessageToChat: (message) => {
    // 1. create a new Message
    let newMessage;
    switch (message.messageType) {
      case "textMessage":
        newMessage = new TextMessage(message.clientID, message.content);
        break;
    }
    // 2. add this new Message to the chat with the given chatID
    dataStructure.chats.find(chat => chat.getChatID() === message.chatID).addMessageToHistory(newMessage);
    
    // 3. return a new message-object
    return {
      chatID: message.chatID,
      senderID: newMessage.getSenderID(),
      content: newMessage.getContent(),
      time: newMessage.getTime(),
      messageType: newMessage.getMessageType()
    };
  },
  // will return an array of all users in the Chat with the specific chatID
  getUsersInChat: (chatID) => {
    return dataStructure.chats.find(chat => chat.getChatID() === chatID).getUsers();
  },
  // save the chat-data to a file
  saveState: () => {
    fs.writeFile(`${__dirname}/data.json`, JSON.stringify(dataStructure), function (err) {
      if (err) return console.log(err);
      console.log("saved Data!");
    });
  },
};

const createResponse = {
  forProfile: (profile) => { // expects a instance of Profile
    return {
      userID: profile.getUserID(),
      userName: profile.getUserName(),
      status: profile.getStatus(),
      contacts: profile.getContacts(),
      //TODO profilePic:,
    };
  }
};

// also need the classes to be able to create instances of them 
/* In this file all the classes used in the Project will be defined */

// Message classes
class Message {
  constructor(senderID, content) {
    this.senderID = senderID;
    this.content = content;
    this.time = this.constructTime();
    this.messageType = "";
  }
  constructTime() {
    let time = new Date();
    return {
      year: time.getFullYear(),
      month: time.getMonth(),
      day: time.getDay(),
      hour: time.getHours(),
      minute: time.getMinutes()
    };
  }

  getSenderID() {return this.senderID;}
  getContent() {return this.content;}
  getTime() {return this.time;}
  getMessageType() {return this.messageType;}
}

class TextMessage extends Message {
  constructor(senderID, text) {
    super(senderID, text);
    this.messageType = "textMessage";
  }
}

class FileMessage extends Message {
  constructor(senderID, text, fileName) {
    super(senderID, text);
    this.fileName = fileName;
    this.messageType = "fileMessage";
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
    this.messageType = "imageMessage";
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
    this.image;
    this.chatType = "chat";
  }

  addMessageToHistory(newMessage) {
    this.history.push(newMessage);
  }
  // getters
  getChatID() {return this.chatID;}
  getUsers() {return this.users;}
  getImage() {return this.image;}
  getHistory() {
    return this.history.map(message => {
      return {
        senderID: message.getSenderID(),
        content: message.getContent(),
        time: message.getTime(),
        messageType: message.getMessageType()
      };
    });
  }
}

class GroupChat extends Chat {
  constructor(chatID, users, groupName) {
    super(chatID, users);
    this.groupName = groupName;
    this.groupPicPath;
    this.chatType = "groupChat";
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
  getGroupName() {return this.groupName;}
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
    this.chatType = "pToPchat";
  }
}


// other classes
class Profile {
  constructor(userName, password) {
    this.userName = userName;
    this.password = password;
    this.userID = crypto.randomUUID();
    this.status = "";
    this.contacts = [];
    this.chatIDs = [];
    this.profilePicFileName = "";
  }
  getContactSavedName(givenID) {
    // gets the savedName of the first contact with the "givenID"
    return this.contacts.find(contact => contact.getUserID() === givenID).getSavedName();
  }
  getUserID() {return this.userID;}
  getUserName() {return this.userName;}
  getStatus() {return this.status;}
  getContacts() {return this.contacts;}
  getProfilePic() {return this.profilePicFileName;} //TODO find a way to implement a picture in here...

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

  // checks if the passwords match
  checkPassword(passwordToCheck) {
    return passwordToCheck === this.password;
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
  getUserID() {
    return this.userID;
  }
  
  setSavedName(newName) {
    this.savedName = newName;
  }
}

/* end of the classes*/


// temporarily test-data will be stored in this file, until I learn about a better way
// the data structure to save all data, used in the Project
let dataStructure = {};

// filling the structure with testData

// create new Profiles
dataStructure.profiles = [
  new Profile("Niklas Flaig", "1234"),
  new Profile("Peter Obama", "4321"),
  new Profile("Katherine", "0000"),
];

// add contacts to profiles
//? sinnvoller den Contact in der methode zu kreieren?
dataStructure.profiles[0].addContact(new Contact(02, "Pete"));
dataStructure.profiles[0].addContact(new Contact(03, "Kat"));

dataStructure.profiles[1].addContact(new Contact(01, "Nikl"));
dataStructure.profiles[1].addContact(new Contact(03, "Kat"));

dataStructure.profiles[2].addContact(new Contact(01, "Niklas"));
dataStructure.profiles[2].addContact(new Contact(02, "Peter O."));

// create new chats
dataStructure.chats = [
  new PToPChat(01, [01, 02]),
  new PToPChat(02, [01, 03]),
  new GroupChat(03, [01, 02, 03], "PizzaGroup"),
];

dataStructure.chats[0].addMessageToHistory(new TextMessage(01, "Pizza?"));
dataStructure.chats[0].addMessageToHistory(new TextMessage(02, "Ok"));
dataStructure.chats[0].addMessageToHistory(new TextMessage(01, "C u 10!"));


dataStructure.chats[1].addMessageToHistory(new TextMessage(03, "Hello?"));
dataStructure.chats[1].addMessageToHistory(new TextMessage(01, "New Phone hu dis?"));


dataStructure.chats[2].addMessageToHistory(new TextMessage(03, "Hi!"));
dataStructure.chats[2].addMessageToHistory(new TextMessage(01, "Nice Group!"));
dataStructure.chats[2].addMessageToHistory(new TextMessage(02, "Why spam?"));


// add chats to Profiles 
// mainly so we don't have to search the chats with the userID in it
dataStructure.profiles[0].addChat(01);
dataStructure.profiles[0].addChat(02);
dataStructure.profiles[0].addChat(03);

dataStructure.profiles[1].addChat(01);
dataStructure.profiles[1].addChat(03);

dataStructure.profiles[2].addChat(02);
dataStructure.profiles[2].addChat(03);
