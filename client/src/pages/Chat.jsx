import React from "react";
import { useParams } from "react-router-dom";

function Chat() {
  const { chatId } = useParams();

  return <div>{chatId}</div>;
}

export default Chat;
