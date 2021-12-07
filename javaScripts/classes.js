// classes
class Chat {
  constructor(chatID, users, history, chatName, image) {
    this.chatID = chatID;
    this.users = users;
    this.history = history;
    this.chatName = chatName;
    this.image = image;
  }
  getChatID() {return this.chatID;}
  getUsers() {return this.users;}
  getHistory() {return this.history;}
  getChatName() {return this.chatName;}
  getImage() {return this.image;}
  getLastMessageText() {
    return this.history.at(-1).getTextResponse();
  }
}

class Message {
  constructor(senderID) {
    this.senderID = senderID;
    this.senderName = this.constructSenderName(senderID);
    this.senderClass = this.constructSenderClass(senderID);
    this.textResponse = "";
    this.content = "";
  }
  constructSenderName(senderID) { //! Kapselung?
    if (senderID === chatApp.clientProfile.userID) {
      return "You: ";
    } else {
      // return chatApp.clientProfile.getContactSavedName(this.senderID) + ": ";
      return chatApp.clientProfile.contacts.find(contact => contact.userID === senderID).savedName + ": "; // without encapsulation!!
    }
  }
  constructSenderClass(senderID) {
    if (senderID === chatApp.clientProfile.userID) {
      return "sendtBy_You";
    } else {
      return "sendtBy_NotYou";
    }
  }

  getSenderName() {return this.senderName;}
  getSenderClass() {return this.senderClass;}
  getTextResponse() {return this.textResponse;}
  getContent() {return this.content;}
}

class TextMessage extends Message {
  constructor(senderID, content) {
    super(senderID);
    this.content = content;
    this.textResponse = content;
  }
}

