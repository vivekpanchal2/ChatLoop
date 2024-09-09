export const sampleChats = [
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "Alice Johnson",
    _id: "1",
    groupChat: false,
    members: ["1", "2"],
  },
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar2.png"],
    name: "Tech Enthusiasts",
    _id: "2",
    groupChat: true,
    members: ["1", "2"],
  },
];

export const sampleUsers = [
  {
    avatar: "https://www.w3schools.com/howto/img_avatar.png",
    name: "Alice Johnson",
    _id: "1",
  },
  {
    avatar: "https://www.w3schools.com/howto/img_avatar2.png",
    name: "Bob Williams",
    _id: "2",
  },
];

export const sampleNotifications = [
  {
    sender: {
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      name: "Alice Johnson",
    },
    _id: "1",
    message: "sent you a message",
  },
  {
    sender: {
      avatar: "https://www.w3schools.com/howto/img_avatar2.png",
      name: "Bob Williams",
    },
    _id: "2",
    message: "added you to the group chat",
  },
];

export const sampleMessages = [
  {
    attachments: [],
    content: "Hey, how's it going?",
    _id: "msg1",
    sender: {
      _id: "1",
      name: "Alice Johnson",
    },
    chat: "chat1",
    createdAt: "2024-02-12T10:41:30.630Z",
  },
  {
    attachments: [
      {
        public_id: "file1",
        url: "https://www.w3schools.com/howto/img_avatar.png",
      },
    ],
    content: "Check out this file!",
    _id: "msg2",
    sender: {
      _id: "2",
      name: "Bob Williams",
    },
    chat: "chat2",
    createdAt: "2024-02-12T11:00:00.000Z",
  },
];

export const dashboardData = {
  users: [
    {
      name: "Alice Johnson",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      _id: "1",
      username: "alice_johnson",
      friends: 10,
      groups: 2,
    },
    {
      name: "Bob Williams",
      avatar: "https://www.w3schools.com/howto/img_avatar2.png",
      _id: "2",
      username: "bob_williams",
      friends: 15,
      groups: 3,
    },
  ],

  chats: [
    {
      name: "Study Group",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      _id: "1",
      groupChat: true,
      members: [
        { _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
        { _id: "2", avatar: "https://www.w3schools.com/howto/img_avatar2.png" },
      ],
      totalMembers: 2,
      totalMessages: 50,
      creator: {
        name: "Alice Johnson",
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
      },
    },
    {
      name: "Developers Lounge",
      avatar: ["https://www.w3schools.com/howto/img_avatar2.png"],
      _id: "2",
      groupChat: true,
      members: [
        { _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
        { _id: "2", avatar: "https://www.w3schools.com/howto/img_avatar2.png" },
      ],
      totalMembers: 3,
      totalMessages: 75,
      creator: {
        name: "Bob Williams",
        avatar: "https://www.w3schools.com/howto/img_avatar2.png",
      },
    },
  ],

  messages: [
    {
      attachments: [],
      content: "Good morning, everyone!",
      _id: "msg3",
      sender: {
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
        name: "Alice Johnson",
      },
      chat: "chat1",
      groupChat: true,
      createdAt: "2024-02-12T09:00:00.000Z",
    },
    {
      attachments: [
        {
          public_id: "image1",
          url: "https://www.w3schools.com/howto/img_avatar2.png",
        },
      ],
      content: "Here's the updated file.",
      _id: "msg4",
      sender: {
        avatar: "https://www.w3schools.com/howto/img_avatar2.png",
        name: "Bob Williams",
      },
      chat: "chat2",
      groupChat: true,
      createdAt: "2024-02-12T10:15:30.000Z",
    },
  ],
};
