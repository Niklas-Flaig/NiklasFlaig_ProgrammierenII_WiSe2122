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
  createNewChat: (newChatData, creatorID) => {
    // 1. get the creators Profile (this is a refference)
    const creatorProfile = dataStructure.profiles.find(profile => profile.getUserID() === creatorID);

    switch (newChatData.chatType) {
      case "pToPChat":
        // 2. search for the other Persons contact
        const otherPersonContact = creatorProfile.getContact(newChatData.userName);

        // 3. create a new PToPChat
        const newChat = new PToPChat([creatorID, otherPersonContact.getUserID()]);
        // 5. add this chat to the dataStructure
        dataStructure.chats.push(newChat);
        // 6. return a newChat Object
        return createResponse.forChat(newChat, creatorID);
      case "groupChat":
        //TODO
        break;
    }

  },
  // will try to create a new Contact, if thats not possible throw an error
  createNewContact: (creatorID, contactName) => {
    // 1. get the Profiles
    const creatorProfile = dataStructure.profiles.find(profile => profile.getUserID() === creatorID);
    const otherPersonsProfile = dataStructure.profiles.find(profile => profile.getUserName() === contactName);

    // 2. check if the otherPersonsProfile exists
    if (otherPersonsProfile !== undefined) {
      // 3. check if this profile doesn't exists
      if (creatorProfile.getContact(contactName) === undefined) {
        // 4. add a new Contact to the creators Profile
        creatorProfile.addContact(otherPersonsProfile.getUserID(), otherPersonsProfile.getUserName());
  
        // 5. return a contactObject
        return createResponse.forContact(creatorProfile.getContact(contactName));
      } else {
        //TODO if i want something to happen, when its tryed to create a Contact that already exists
      }
    } else {
      err = 521; // the profile the creator wants in the chat doesn't exist
      throw err;
    }
  },
  // will return all Chats, in wich a User participates
  getChatsWithUser: function (requesterID) {
    // filters the chats with the users ID (requesterID) as a participant
    let relevantChats = dataStructure.chats.filter(chat => chat.getUsers().find(userIDInThisChat => userIDInThisChat === requesterID) === requesterID);
    
    // create array of Objects that can be used on client side to create new Chat instances
    return relevantChats.map(chat =>  createResponse.forChat(chat, requesterID));
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
  },
  forChat: (chat, requesterID) => { // expects an instance of a Child of Chat
    // type-independent values
    let chatObject = {
      chatID: chat.getChatID(),
      users: chat.getUsers(), //? needed?
      history: chat.getHistory(),
      image: chat.getImage(),
      chatType: chat.getChatType()
    };

    // type-dependent values
    switch (chat.chatType) {
      case "groupChat":
        chatObject.chatName = chat.getGroupName();
        break;
      case "pToPchat":
        // take the other users name, saved to the profile of the requesters Profile
        let otherUsersID = chat.getUsers().find(userID => userID !== requesterID);
        chatObject.chatName = dataStructure.profiles.find(profile => profile.getUserID() === requesterID).getContactSavedName(otherUsersID);
        break;
    }

    return chatObject;
  },
  forContact: (contact) => {
    return {
      userID: contact.getUserID(),
      savedName: contact.getSavedName()
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
  constructor(users) {
    this.chatID = crypto.randomUUID();
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
  getChatType() {return this.chatType;}
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
  constructor(users, groupName) {
    super(users);
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
  constructor(users) {
    super(users);
    this.chatType = "pToPChat";
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
  getContacts() {return this.contacts;}//TODO kapselung
  getContact(contactName) {return this.contacts.find(contact => contact.getSavedName() === contactName);}
  getProfilePic() {return this.profilePicFileName;} //TODO find a way to implement a picture in here...

  setStatus(newStatus) {
    this.status = newStatus;
  }
  addContact(userID, contactName) {
    this.contacts.push(new Contact(userID, contactName));
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
dataStructure.profiles[0].addContact(dataStructure.profiles[1].getUserID(), "Pete");
dataStructure.profiles[0].addContact(dataStructure.profiles[2].getUserID(), "Kat");

dataStructure.profiles[1].addContact(dataStructure.profiles[0].getUserID(), "Nikl");
dataStructure.profiles[1].addContact(dataStructure.profiles[2].getUserID(), "Kat");

dataStructure.profiles[2].addContact(dataStructure.profiles[0].getUserID(), "Niklas");
dataStructure.profiles[2].addContact(dataStructure.profiles[1].getUserID(), "Peter O.");

// create new chats
dataStructure.chats = [
  new PToPChat([dataStructure.profiles[0].getUserID(), dataStructure.profiles[1].getUserID()]),
  new PToPChat([dataStructure.profiles[0].getUserID(), dataStructure.profiles[2].getUserID()]),
  new GroupChat([dataStructure.profiles[0].getUserID(), dataStructure.profiles[1].getUserID(), dataStructure.profiles[2].getUserID()], "PizzaGroup"),
];

dataStructure.chats[0].addMessageToHistory(new TextMessage(dataStructure.profiles[0].getUserID(), "Pizza?"));
dataStructure.chats[0].addMessageToHistory(new TextMessage(dataStructure.profiles[1].getUserID(), "Ok"));
dataStructure.chats[0].addMessageToHistory(new TextMessage(dataStructure.profiles[0].getUserID(), "C u 10!"));


dataStructure.chats[1].addMessageToHistory(new TextMessage(dataStructure.profiles[2].getUserID(), "Hello?"));
dataStructure.chats[1].addMessageToHistory(new TextMessage(dataStructure.profiles[0].getUserID(), "New Phone hu dis?"));


dataStructure.chats[2].addMessageToHistory(new TextMessage(dataStructure.profiles[2].getUserID(), "Hi!"));
dataStructure.chats[2].addMessageToHistory(new TextMessage(dataStructure.profiles[0].getUserID(), "Nice Group!"));
dataStructure.chats[2].addMessageToHistory(new TextMessage(dataStructure.profiles[1].getUserID(), "Why spam?"));


// add chats to Profiles 
// mainly so we don't have to search the chats with the userID in it
dataStructure.profiles[0].addChat(dataStructure.chats[0].getChatID());
dataStructure.profiles[0].addChat(dataStructure.chats[1].getChatID());
dataStructure.profiles[0].addChat(dataStructure.chats[2].getChatID());

dataStructure.profiles[1].addChat(dataStructure.chats[0].getChatID());
dataStructure.profiles[1].addChat(dataStructure.chats[2].getChatID());

dataStructure.profiles[2].addChat(dataStructure.chats[1].getChatID());
dataStructure.profiles[2].addChat(dataStructure.chats[2].getChatID());
