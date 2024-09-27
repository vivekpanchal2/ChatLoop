import React, { memo } from "react";
import { Link } from "react-router-dom";
import AvatarCard from "./AvatarCard";
import { motion } from "framer-motion";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
  onChatClick,
}) => {
  return (
    <div
      onClick={onChatClick}
      className="block cursor-pointer relative"
    >
      <Link
        to={`/chat/${_id}`}
        onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
        className="block"
      >
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.01 * index }}
          className={`flex gap-8 items-center p-4 relative transition-colors duration-300 ${
            sameSender ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          {/* Avatar Container */}
          <div className="relative flex items-center">
            {/* Avatar */}
            <AvatarCard avatar={avatar} />

            {/* Online Indicator */}
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-lg transform scale-100 transition-transform duration-300 ease-in-out" />
            )}
          </div>

          {/* Chat Info */}
          <div className="flex flex-col">
            <span className="text-lg font-inter">{name}</span>
            {newMessageAlert && (
              <span className="text-sm text-red-500">
                {newMessageAlert.count} New Message
                {newMessageAlert.count > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </motion.div>
      </Link>
    </div>
  );
};

export default memo(ChatItem);
