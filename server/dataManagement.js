// makes the functions available in form of a module (https://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files)
module.exports = {
  // will return all Chats, in wich a User participates
  getChatsWithUser: function (participantsUserID) {
    // filters the chats with the users ID (participantsUserID) as a participant
    let relevantChats = dataStructure_Chats.filter(chat => chat.getUsers().find(userIDInThisChat => userIDInThisChat === participantsUserID) === participantsUserID);
    
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
          chatObject.chatName = dataStructure_Profiles.find(profile => profile.getUserID() === participantsUserID).getContactSavedName(otherUsersID);
          break;
      }
      
      return chatObject;
    });
  },
  // will return the profile with the given userID
  getProfile: function (profilesUserID) {
    let usersProfile = dataStructure_Profiles.find(profile => profile.getUserID() === profilesUserID);

    // the object, getting returned here, keeps just the Data, that is usefull for the client
    return {
      userID: usersProfile.getUserID(),
      userName: usersProfile.getUserName(),
      status: usersProfile.getStatus(),
      contacts: usersProfile.getContacts(),
      //TODO profilePic:,
    };
  },
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
      year: time.getFullYear,
      month: time.getMonth,
      day: time.getDay,
      hour: time.getHours,
      minute: time.getMinutes
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

  getContent() {
    return this.text;
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

  addToHistory(message) {
    this.history.push(message);
  }
  // getters
  getChatID() {return this.chatID;}
  getUsers() {return this.users;}
  getImage() {return this.image;}
  getHistory() {
    return this.history.map(message => {
      return {
        sender: message.getSender(),
        content: message.getContent(),
        time: message.getTime(),
        messageType: message.messageType()
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
  constructor(userID, userName, password) {
    this.userID = userID;
    this.userName = userName;
    this.password = password;
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