import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { setIsDeleteMenu } from "../../redux/slices/misc";
import { useNavigate } from "react-router-dom";
import { useAsyncMutation } from "../../hooks/hooks";
import { FaTrashAlt, FaSignOutAlt } from "react-icons/fa";
import { deleteChat, leaveGroup } from "../../services/operations/chat";
import toast from "react-hot-toast";
import { useLeaveGroupMutation } from "../../redux/api/api";

const DeleteChatMenu = ({ dispatch, deleteMenuAnchor }) => {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const { isDeleteMenu, selectedDeleteChat } = useSelector(
    (state) => state.misc
  );
  console.log("In Dlete Chat");

  const isGroup = selectedDeleteChat.groupChat;

  const closeHandler = () => {
    dispatch(setIsDeleteMenu(false));
    deleteMenuAnchor.current = null;
  };

  const leaveGroupHandler = async () => {
    closeHandler();
    await leaveGroup(selectedDeleteChat.chatId);
    navigate("/");
  };

  const deleteChatHandler = () => {
    closeHandler();
    toast.success("Deleting Chat....");
    deleteChat(selectedDeleteChat.chatId);
    navigate("/");
  };

  // useEffect(() => {
  //   if (leaveGroupData) navigate("/");
  // }, [leaveGroupData]);

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeHandler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Backdrop with blur effect */}
      {isDeleteMenu && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-sm bg-black bg-opacity-50"
          onClick={closeHandler} // Clicking on backdrop will close the menu
        />
      )}

      {/* Delete Chat Menu */}
      <div
        ref={menuRef}
        className={`fixed z-50 bg-white shadow-lg rounded-md transition-opacity duration-300 transform ${
          isDeleteMenu
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{
          top:
            deleteMenuAnchor.current?.getBoundingClientRect().bottom +
            window.scrollY,
          left: deleteMenuAnchor.current?.getBoundingClientRect().left,
        }}
      >
        <div
          className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-100 rounded-md"
          onClick={isGroup ? leaveGroupHandler : deleteChatHandler}
        >
          {isGroup ? (
            <>
              <FaSignOutAlt className="text-red-600" />
              <span className="text-sm font-medium text-gray-700">
                Leave Group
              </span>
            </>
          ) : (
            <>
              <FaTrashAlt className="text-red-600" />
              <span className="text-sm font-medium text-gray-700">
                Delete Chat
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DeleteChatMenu;
