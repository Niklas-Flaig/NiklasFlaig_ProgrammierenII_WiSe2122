// classes
class Chat {
  constructor(chatID, users, history, chatName, image) {
    this.chatID = chatID;
    this.users = users;
    this.history = history;
    this.chatName = chatName;
    this.image = image;
  }
  addMessage(message) {
    let newMessage;
    switch (message.messageType) {
      case "textMessage":
        newMessage = new TextMessage(
          message.senderID,
          message.content,
          message.time
        );
    }
    this.history.push(newMessage);
  }

  getChatID() {return this.chatID;}
  getUsers() {return this.users;}
  getChatName() {return this.chatName;}
  getImage() {return this.image;}
  getHistory() {
    // when theres no history, display a sorry-message
    if (this.history.length > 0) {
      return this.history;
    } else {
      return "TODO";
    }
  }
  getLastMessageText() {
    // when theres no lastMessage, display a sorry-message
    if (this.history.length > 0) {
      return this.history.at(-1).getTextResponse();
    } else {
      return "TODO";
    }
  }
}

class Message {
  constructor(senderID, time) {
    this.senderID = senderID;
    this.time = time;
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
  getTimeToDisplay() {return `${this.time.hour}:${this.time.minute}`;}

  getSenderName() {return this.senderName;}
  getSenderClass() {return this.senderClass;}
  getTextResponse() {return this.textResponse;}
  getContent() {return this.content;}
}

class TextMessage extends Message {
  constructor(senderID, content, time) {
    super(senderID, time);
    this.content = content;
    this.textResponse = content;
  }
}

