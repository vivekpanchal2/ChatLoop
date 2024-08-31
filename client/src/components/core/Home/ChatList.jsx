import React from "react";

function ChatList() {
  return (
    <div className="h-full w-full flex flex-col">
      {Array.from({ length: 10 }).map((x, index) => (
        <div
          className="w-full h-10 py-5 my-2 bg-richblack-400  border"
          key={index}
          onClick={() => {
            console.log(`user ${index} is clicked`);
          }}
        >
          {" "}
          User{" "}
        </div>
      ))}
    </div>
  );
}

export default ChatList;
