import React from "react";
import ChatItem from "../shared/ChatItem";

const ChatList = ({
  w = "w-full",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
  onChatClick,
}) => {
  console.log({ onlineUsers });
  return (
    <div className={`flex flex-col ${w} overflow-auto h-full border-b-2`}>
      {chats?.map((data, index) => {
        const { avatar, _id, name, groupChat, members } = data;

        const newMessageAlert = newMessagesAlert.find(
          ({ chatId }) => chatId === _id
        );

        const isOnline = members?.some((member) =>
          onlineUsers.includes(member)
        );

        console.log(isOnline);

        return (
          <ChatItem
            index={index}
            newMessageAlert={newMessageAlert}
            isOnline={isOnline}
            avatar={avatar}
            name={name}
            _id={_id}
            key={_id}
            groupChat={groupChat}
            sameSender={chatId === _id}
            handleDeleteChat={handleDeleteChat}
            onChatClick={onChatClick} 
          />
        );
      })}
    </div>
  );
};

export default ChatList;
