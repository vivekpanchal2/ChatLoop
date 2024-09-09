import React from "react";

export const LayoutLoader = () => {
  return (
    <div className="flex h-[calc(100vh-4rem)] space-x-4 p-4">
      {/* Sidebar */}
      <div className="hidden sm:block w-1/4 md:w-1/5 lg:w-1/6 h-full">
        <div className="bg-gray-300 h-full rounded-lg animate-pulse"></div>
      </div>

      {/* Main Content */}
      <div className="w-full sm:w-2/3 md:w-1/2 lg:w-3/5 h-full space-y-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-300 h-20 rounded-lg animate-pulse"
          ></div>
        ))}
      </div>

      {/* Right Sidebar */}
      <div className="hidden md:block w-1/4 lg:w-1/6 h-full">
        <div className="bg-gray-300 h-full rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
};

export const TypingLoader = () => {
  return (
    <div className="flex space-x-2 justify-center p-2">
      <div className="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-100"></div>
      <div className="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-200"></div>
      <div className="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-400"></div>
      <div className="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-600"></div>
    </div>
  );
};
