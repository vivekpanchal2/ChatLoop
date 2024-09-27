import React from "react";
import moment from "moment";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col items-center bg-gray-100 rounded-lg shadow-lg w-full max-w-lg  overflow-hidden h-[calc(100vh-5rem)]">
      <img
        src={user?.avatar?.url}
        alt="Avatar"
        className="w-32 h-32 rounded-full object-cover mb-6 border-4 border-gray-300 shadow-md"
      />
      <div className="flex flex-col w-full space-y-4">
        <div className="flex flex-col bg-white p-2 rounded-lg shadow-md">
          <div className="flex items-center space-x-3 m-2">
            <span className="text-xl text-gray-500">📝</span>
            <div className="text-left">
              <p className="text-lg font-medium text-gray-700">Bio</p>
            </div>
          </div>
          <p className="text-gray-700 m-2">{user?.bio}</p>
        </div>

        <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-md">
          <span className="text-2xl text-gray-500">@</span>
          <div className="text-left">
            <p className="text-lg font-medium text-gray-700">
              {user?.username}
            </p>
            <p className="text-gray-500 text-sm">Username</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-md">
          <span className="text-2xl text-gray-500">🙂</span>
          <div className="text-left">
            <p className="text-lg font-medium text-gray-700">{user?.name}</p>
            <p className="text-gray-500 text-sm">Name</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-md">
          <span className="text-2xl text-gray-500">📅</span>
          <div className="text-left">
            <p className="text-lg font-medium text-gray-700">
              {moment(user?.createdAt).fromNow()}
            </p>
            <p className="text-gray-500 text-sm">Joined</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
