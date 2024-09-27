import React, { memo } from "react";
import moment from "moment";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";
import { motion } from "framer-motion";

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;

  const sameSender = sender?._id === user?._id;
  const timeAgo = moment(createdAt).fromNow();

  return (
    <motion.div
      initial={{ opacity: 0, x: sameSender ? "100%" : "-100%" }}
      whileInView={{ opacity: 1, x: 0 }}
      className={`flex ${sameSender ? "justify-end" : "justify-start"} mb-4`}
    >
      <div className={`max-w-xs px-4 py-2 rounded-lg text-black border-2`}>
        {!sameSender && (
          <p className="text-richblue-800 font-semibold text-sm mb-1">
            {sender.name}
          </p>
        )}

        {content && <p className="whitespace-pre-wrap">{content}</p>}

        {attachments.length > 0 &&
          attachments.map((attachment, index) => {
            const url = attachment.url;
            const file = fileFormat(url);

            return (
              <div key={index} className="mt-1">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="text-black"
                >
                  {RenderAttachment(file, url)}
                </a>
              </div>
            );
          })}

        <p className="text-gray-500 text-xs mt-1">{timeAgo}</p>
      </div>
    </motion.div>
  );
};

export default memo(MessageComponent);
