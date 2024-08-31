import React from "react";
import { Link } from "react-router-dom";
import { MdError } from "react-icons/md";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-3rem)]">
      <div className="flex flex-col items-center space-y-4">
        <MdError className="text-9xl" />
        <h1 className="text-6xl">404</h1>
        <h2 className="text-4xl">Not Found</h2>
        <Link to="/" className="text-blue-500 hover:underline">
          Go back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
