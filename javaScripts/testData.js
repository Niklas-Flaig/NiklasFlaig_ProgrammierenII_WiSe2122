let backup = [
  {
    users: [
      000001,
      000003
    ],
    chatType: "singleChat",
    history: [
      {
        time: [21, 10, 23, 16, 56, 23],
        messageID: 01,
        type: "text",
        content: "Hi!",
        sender: 000001,
      },
      {
        time: [21, 10, 23, 17, 01, 32],
        messageID: 01,
        type: "text",
        content: "New Phone, who dis?",
        sender: 000003,
      },
      {
        time: [21, 10, 23, 17, 02, 54],
        messageID: 01,
        type: "text",
        content: "It'se me Mario!",
        sender: 000001,
      }
    ]
  },{
    users: [
      000001,
      000002,
      000003
    ],
    chatType: "groupChat",
    chatName: "PowerGroup",
    history: [
      {
        time: [21, 10, 23, 16, 56, 23],
        messageID: 01,
        type: "text",
        content: "Heyo!",
        sender: 000001,
      },
      {
        time: [21, 10, 23, 17, 01, 32],
        messageID: 01,
        type: "text",
        content: "Wassup?",
        sender: 000002,
      },
      {
        time: [21, 10, 23, 17, 02, 54],
        messageID: 01,
        type: "text",
        content: "Gimme da Pizza!",
        sender: 000003,
      }
    ]
  },
]

let testProfile = {
  id: 000001,
  contacts: [
    {
      id: 000002,
      savedName: "Gray Gru",
    },
    {
      id: 000003,
      savedName: "Peter G.",
    }
  ],
  status: "An apple a day, macht dich ganz schnell arm!"
}