
// will return all Chats, in wich this User participates
function getRequestedChatsForUser (userIDFromRequest) {
  let chatsForUser = [];
  
  // filters the chats with the users ID (userIDFromRequest) as a member
  chatsForUser = dataStructure_Chats.filter(chat => chat.users.find(userIDInThisChat => userIDInThisChat === userIDFromRequest) === userIDFromRequest)
  console.log(chatsForUser);
  
  // returns the requested chats in form of an array
  return chatsForUser;
}




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
]

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