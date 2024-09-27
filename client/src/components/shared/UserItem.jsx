import { FaUserPlus as AddIcon } from "react-icons/fa";
import { MdOutlinePersonRemove as RemoveIcon } from "react-icons/md";
import React, { memo } from "react";
import { transformImage } from "../../lib/features";

const UserItem = ({ user, handler, handlerIsLoading, isAdded = false }) => {
  const { name, _id, avatar } = user;

  return (
    <li className="flex items-center space-x-4 w-full px-4 py-2 border-b last:border-b-0">
      <img
        src={transformImage(avatar)}
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <p className="flex-1 truncate">{name}</p>
      <button
        onClick={() => handler(_id)}
        disabled={handlerIsLoading}
        className={`flex items-center justify-center w-8 h-8 rounded-full text-white ${
          isAdded ? "bg-pink-700 " : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isAdded ? (
          <RemoveIcon className=" text-xl" />
        ) : (
          <AddIcon className="text-xl" />
        )}
      </button>
    </li>
  );
};

export default memo(UserItem);
