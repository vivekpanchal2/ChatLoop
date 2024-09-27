import { FaSearch, FaUserPlus as AddIcon } from "react-icons/fa";
import { MdOutlinePersonRemove as RemoveIcon } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../../redux/slices/misc";
import {
  searchUser,
  sendFriendRequest,
  cancelSendFriendRequest,
} from "../../services/operations/friend";
import { transformImage } from "../../lib/features";

const Search = () => {
  const dispatch = useDispatch();
  const { isSearch } = useSelector((state) => state.misc);
  const [searchName, setSearchName] = useState("");
  const [users, setUsers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await dispatch(searchUser(searchName || ""));
      if (response?.users) {
        setUsers(response.users);
        setPendingRequests(response.pendingRequest.map((req) => req.receiver));
      }
    } catch (e) {
      console.error("Error searching users:", e);
    }
  };

  useEffect(() => {
    if (isSearch) fetchUsers();
    if (searchName) {
      const timeoutId = setTimeout(fetchUsers, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [searchName, isSearch]);

  const handleRequest = async (id, isAdded) => {
    if (isAdded) {
      await cancelSendFriendRequest(id);
    } else {
      await sendFriendRequest(id);
    }
    fetchUsers();
  };

  const handleClickOutside = (e) => {
    if (e.target.id === "modal-backdrop") dispatch(setIsSearch(false));
  };

  return (
    <div
      id="modal-backdrop"
      onClick={handleClickOutside}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 backdrop-blur-md ${
        isSearch ? "block" : "hidden"
      }`}
    >
      <div
        className="relative bg-white rounded-lg w-96 border-2 p-6 flex flex-col h-[70vh] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Send Friend Request to Connect
          </h3>
        </div>

        <div className="mb-4 relative">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg py-2 px-4 pl-10 focus:ring-2 focus:ring-blue-500 text-gray-800"
            placeholder="Search for users..."
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <FaSearch className="text-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-8">
          <ul>
            {users.map((user) => (
              <UserItem
                user={user}
                key={user._id}
                handleRequest={handleRequest}
                isAdded={pendingRequests.includes(user._id)}
              />
            ))}
          </ul>
        </div>

        <button
          onClick={() => dispatch(setIsSearch(false))}
          className="w-full bg-red-500 text-black py-2 rounded-lg border-2 hover:bg-red-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const UserItem = ({ user, handleRequest, isAdded = false }) => {
  const { name, _id, avatar } = user;

  return (
    <li className="flex justify-between items-center space-x-4 px-4 py-3 border-b border-gray-200 hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-4">
        <img
          src={transformImage(avatar)}
          alt="User avatar"
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.target.src = "https://i.ibb.co/RQg5mWz/image.jpg";
          }}
        />

        <p className="font-medium text-gray-800 truncate">{name}</p>
      </div>
      <div>
        <button
          onClick={() => handleRequest(_id, isAdded)}
          className={`flex items-center justify-center w-8 h-8 rounded-full text-white transition-colors ${
            isAdded
              ? "bg-green-500 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isAdded ? (
            <RemoveIcon className="text-white" />
          ) : (
            <AddIcon className="text-white" />
          )}
        </button>
      </div>
    </li>
  );
};

export default Search;
