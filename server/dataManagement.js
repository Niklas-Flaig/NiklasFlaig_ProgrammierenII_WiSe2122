
// will return all Chats, in wich this User participates
function getRequestedChatsForUser (userIDFromRequest) {
  let chatsForUser = [];
  
  // filters the chats with the users ID (userIDFromRequest) as a member
  chatsForUser = dataStructure_Chats.filter(chat => chat.users.find(userIDInThisChat => userIDInThisChat === userIDFromRequest) === userIDFromRequest)
  console.log(chatsForUser);
  
  // returns the requested chats in form of an array
  return chatsForUser;
}