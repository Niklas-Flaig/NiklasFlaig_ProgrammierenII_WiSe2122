// classes
class Chat {
  constructor(chatID, users, history, chatName, image) {
    this.chatID = chatID;
    this.users = users;
    this.history = [];
    history.forEach(message => this.addMessage(message));
    this.chatName = chatName;
    this.image = image;
  }
  addMessage(message) {
     // create a new object of a Message-class child-class
    let newMessage;
    // determine what type of message this is
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
  getHistory() {
    if (this.history.length > 0) {
      return this.history;
    } else {
      return [new TextMessage( // a placeholderMessage
        chatApp.clientProfile.userID,
        "",
        {
          "year": 0,
          "month": 0,
          "day": 0,
          "hour": 0,
          "minute": 0
        }
      )];
    }
  }
  getChatName() {return this.chatName;}
  getImage() {return this.image;}
  getLastMessageText() {
    // when theres no lastMessage, display a sorry-message
    if (this.history.length > 0) {
      return this.history.at(-1).getTextResponse();
    } else {
      return "TODO";
    }
  }
}

class pToPChat extends Chat {
  constructor(chatID, users, history, image) {
    super(chatID, users, history, this.createchatName(), image);
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

