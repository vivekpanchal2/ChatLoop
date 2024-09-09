import React from "react";
import ChatList from "../components/core/Home/ChatList";
import ChatWindow from "../components/core/Home/ChatWindow";
import UserProfile from "../components/core/Home/userProfile";

function Home() {
  return (
    <div className="flex flex-row">
      <div className="hidden min-[500px]:block w-3/6 h-[calc(100vh-4rem)] bg-richblack-500 p-4">
        <ChatList />
      </div>

      <div className="w-full h-[calc(100vh-4rem)] bg-richblack-800 p-4">
        <ChatWindow />
      </div>

      <div className="hidden lg:block w-2/6 h-[calc(100vh-4rem)] bg-richblack-500 p-4">
        <UserProfile />
      </div>
    </div>
  );
}

export default Home;
