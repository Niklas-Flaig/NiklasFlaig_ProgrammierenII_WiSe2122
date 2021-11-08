// the data structure to save all data, used in the Project
let profiles = [];
let chats = [];

// filling the structure with testData

// create new Profiles
profiles = [
  new Profile(01, "Niklas Flaig", 1234),
  new Profile(02, "Peter Obama", 4321),
  new Profile(03, "Katherine", 0000),
]

// add contacts to profiles
//? sinnvoller den Contact in der methode zu kreieren?
profiles[0].addContact(new Contact(02, "Pete"));
profiles[0].addContact(new Contact(03, "Kat"));

profiles[1].addContact(new Contact(01, "Nikl"));
profiles[1].addContact(new Contact(03, "Kat"));

profiles[2].addContact(new Contact(01, "Niklas"));
profiles[2].addContact(new Contact(02, "Peter O."));

// create new chats
chats = [
  new PToPChat(01, [01, 02]),
  new PToPChat(02, [01, 03]),
  new GroupChat(03, [01, 02, 03]),
]

chats[0].addToHistory(new TextMessage(01, "Pizza?"));
chats[0].addToHistory(new TextMessage(02, "Ok"));
chats[0].addToHistory(new TextMessage(01, "C u 10!"));


chats[1].addToHistory(new TextMessage(03, "Hello?"));
chats[1].addToHistory(new TextMessage(01, "New Phone hu dis?"));


chats[2].addToHistory(new TextMessage(03, "Hi!"));
chats[2].addToHistory(new TextMessage(01, "Nice Group!"));
chats[2].addToHistory(new TextMessage(02, "Why spam?"));


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