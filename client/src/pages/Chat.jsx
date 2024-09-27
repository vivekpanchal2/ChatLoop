import React, { useCallback, useEffect, useRef, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { getSocket } from "../socket";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";
import { MdAttachFile } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { useInfiniteScrollTop } from "../hooks/hooks";
import { setIsFileMenu } from "../redux/slices/misc";
import { useDispatch } from "react-redux";
import { removeNewMessagesAlert } from "../redux/slices/chat";
import { TypingLoader } from "../components/layout/Loaders";
import { useNavigate } from "react-router-dom";
import MessageComponent from "../components/shared/MessageComponent";
import { getChatDetails, getMessages } from "../services/operations/chat";
import { useErrors, useSocketEvents } from "../hooks/hooks";
import { useSelector } from "react-redux";
import FileMenu from "../components/dialogs/FileMenu";

const useFetchChatData = (chatId, page) => {
  const [data, setData] = useState({ chatDetails: [], messages: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chatDetailsResult = await getChatDetails(chatId);
        const messagesResult = await getMessages(chatId, page);
        setData({ chatDetails: chatDetailsResult, messages: messagesResult });
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [chatId, page]);

  return { data, isLoading, isError };
};

const Chat = ({ chatId, user }) => {
  const { isFileMenu } = useSelector((state) => state.misc);

  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const containerRef = useRef(null); // Reference for message container
  const typingTimeout = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);

  const { data, isLoading, isError } = useFetchChatData(chatId, page);

  const { chatDetails, messages: oldMessagesChunk } = data;

  const members = chatDetails.chat?.members || [];

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.totalPages,
    page,
    setPage,
    oldMessagesChunk?.messages,
    true // Prepends the data
  );

  useErrors([
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  //---------------------------------------------------
  const messageOnChange = (e) => {
    setMessage(e.target.value);

    console.log(IamTyping);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, 2000);
  };
  //---------------------------------------------------

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const newMessagesListener = useCallback(
    (data) => {
      console.log(data);
      if (data.chatId !== chatId) return;

      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: { _id: "adminId", name: "Admin" },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandler);

  const allMessages = [...oldMessages, ...messages];

  return isLoading ? (
    <div className="animate-pulse">Loading...</div>
  ) : (
    <div className="h-full flex flex-col ">
      {/* Message container with its own scroll */}
      <div
        ref={containerRef}
        className="flex-grow overflow-y-auto p-4 space-y-4"
      >
        {allMessages.map((msg) => (
          <MessageComponent key={msg._id} message={msg} user={user} />
        ))}

        {/* Typing indicator */}
        {userTyping && <TypingLoader />}
      </div>

      {/* Input form */}
      <form
        onSubmit={submitHandler}
        className="h-[10%] bg-white border-gray-200 relative"
      >
        <div className="flex items-center h-full px-4 relative">
          <button
            type="button"
            className="absolute left-8 transform rotate-30"
            onClick={() => dispatch(setIsFileMenu(!isFileMenu))}
          >
            <MdAttachFile className="w-6 h-6 text-black" />
          </button>

          <input
            type="text"
            placeholder="Type Message Here..."
            value={message}
            onChange={messageOnChange}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-black pl-16"
          />

          <button
            type="submit"
            className="ml-4 bg-orange-500 text-black p-2 rounded-md hover:bg-red-600 transform -rotate-30"
          >
            <IoSend className="w-6 h-6" />
          </button>
        </div>

        {isFileMenu && (
          <div className="absolute bottom-[calc(100%-10px)] left-7 z-40 bg-white  shadow-lg border rounded-md w-40 overflow-hidden">
            <FileMenu chatId={chatId} />
          </div>
        )}
      </form>
    </div>
  );
};

export default AppLayout(Chat);
