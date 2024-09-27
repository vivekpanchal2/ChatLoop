import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../../constants/events";
import { useSocketEvents } from "../../hooks/hooks";
import { getOrSaveFromStorage } from "../../lib/features";
import { getMyChats } from "../../services/operations/chat";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/slices/chat";
import {
  setIsDeleteMenu,
  setIsMobile,
  setSelectedDeleteChat,
} from "../../redux/slices/misc";
import { getSocket } from "../../socket";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";
import Navbar from "../common/Navbar";
import { IoCaretBackCircle as Back } from "react-icons/io5";

const useFetchChats = (dispatch) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchChats = async () => {
    try {
      const chatResponse = await dispatch(getMyChats());
      setData(chatResponse);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [dispatch]);
  return { data, isLoading, isError, refetch: fetchChats };
};

const AppLayout = (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const socket = getSocket();
    const chatId = params.chatId;
    const deleteMenuAnchor = useRef(null);

    const [showChatList, setShowChatList] = useState(true);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);

    const { data, isLoading, isError, refetch } = useFetchChats(dispatch);

    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 768) {
          dispatch(setIsMobile(true));
        } else {
          dispatch(setIsMobile(false));
        }
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, [dispatch]);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handleChatClick = () => {
      if (isMobile) {
        setShowChatList(false);
      }
    };

    const handleDeleteChat = (e, chatId, groupChat) => {
      deleteMenuAnchor.current = e.currentTarget;
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
    };

    const handleMobileClose = () => setShowChatList(false);
    const handleMobileOpen = () => setShowChatList(true);

    const newMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId, dispatch]
    );

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListener = useCallback(() => {
      refetch();
      console.log("Refeched.......");
      navigate("/");
    }, [refetch, navigate]);

    const onlineUsersListener = useCallback((data) => {
      console.log(" online users data", data);
      setOnlineUsers(data);
    }, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };

    useSocketEvents(socket, eventHandlers);

    if (isError) {
      return <div className="text-red-500">Error fetching chats</div>;
    }

    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <Title />
        <Navbar />

        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />

        <div className="flex flex-1 overflow-hidden">
          {isMobile && showChatList && (
            <>
              <div className="fixed inset-0 z-40 w-4/5 sm:w-3/5 bg-white shadow-lg transition-transform duration-300 ease-in-out top-16 p-4">
                <button
                  onClick={handleMobileClose}
                  className=" top-4 right-4 bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                >
                  Close
                </button>
                <ChatList
                  chats={data?.chats}
                  chatId={chatId}
                  handleDeleteChat={handleDeleteChat}
                  newMessagesAlert={newMessagesAlert}
                  onlineUsers={onlineUsers}
                  onChatClick={handleChatClick}
                />
              </div>
            </>
          )}

          <div className="hidden md:flex md:w-4/12 lg:w-3/12 h-full bg-gray-100 border-r border-gray-200 p-4">
            <ChatList
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
              onlineUsers={onlineUsers}
              onChatClick={handleChatClick}
            />
          </div>

          <div className="flex-1 bg-white p-4 overflow-auto">
            {isMobile && !showChatList && (
              <button
                onClick={handleMobileOpen}
                className="flex items-center gap-2"
              >
                <Back />
                Back to Chat List
              </button>
            )}
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </div>

          <div className="hidden lg:block lg:w-3/12 p-6 bg-gray-900">
            <Profile user={user} />
          </div>
        </div>
      </div>
    );
  };
};

export default AppLayout;
