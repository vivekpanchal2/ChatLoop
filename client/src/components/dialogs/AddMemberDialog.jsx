import React, { useState, useEffect } from "react";
import { sampleUsers } from "../../constants/sampleData";
import UserItem from "../shared/UserItem";
import {
  useAddGroupMembersMutation,
  useAvailableFriendsQuery,
} from "../../redux/api/api";
import { getMyFriends } from "../../services/operations/friend";
import { addGroupMember } from "../../services/operations/groups";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../../redux/slices/misc";

import { useAsyncMutation, useErrors } from "../../hooks/hooks";

const AddMemberDialog = ({ chatId, getGroupDetailsData }) => {
  const dispatch = useDispatch();
  const { isAddMember } = useSelector((state) => state.misc);

  const [data, setData] = useState("");

  const { loading } = useSelector((state) => state.chat);

  useEffect(() => {
    async function getFriends() {
      const data = await getMyFriends(chatId);
      console.log(data);
      setData(data);
    }
    getFriends();
  }, []);

  console.log({ friendData: data });

  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  const closeHandler = () => {
    dispatch(setIsAddMember(false));
  };

  const addMemberSubmitHandler = async () => {
    await dispatch(addGroupMember({ members: selectedMembers, chatId }));
    await getGroupDetailsData();
    closeHandler();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${
        isAddMember ? "block" : "hidden"
      }`}
      onClick={closeHandler}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-80 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-center mb-4">Add Member</h2>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center">
              <svg
                className="animate-spin h-6 w-6 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>
          ) : data?.friends?.length > 0 ? (
            data?.friends?.map((i) => (
              <UserItem
                key={i._id}
                user={i}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          ) : (
            <p className="text-center">No Friends</p>
          )}
        </div>

        <div className="flex justify-evenly mt-6">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            onClick={closeHandler}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={addMemberSubmitHandler}
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white inline-block"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              "Submit Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberDialog;
