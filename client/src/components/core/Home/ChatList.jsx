import React, { useEffect } from "react";
import { getMyChats } from "../../../services/operations/chat";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function ChatList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { chats = [], loading } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(getMyChats());
  }, [dispatch]);

  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="h-full w-full flex flex-col  bg-gray-100">
      {chats.length === 0 ? (
        <div className="text-center text-gray-500 py-4">No chats available</div>
      ) : (
        chats.map((chat) => (
          <div
            className="flex items-center p-3 mb-3 bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition "
            key={chat._id}
            onClick={() => handleChatClick(chat._id)}
          >
            <img
              src={chat.avatar[0]}
              alt="🚀"
              className="w-10 h-10 rounded-full object-cover mr-4 border border-gray-300"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-800">
                {chat.name}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ChatList;
