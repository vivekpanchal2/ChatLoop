import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setIsNewGroup } from "../../redux/slices/misc";
import toast from "react-hot-toast";
import UserItem from "../shared/UserItem";
import { getMyFriends } from "../../services/operations/friend";
import { newGroupChat } from "../../services/operations/groups";
import { useNavigate } from "react-router-dom";

const NewGroup = () => {
  const { isNewGroup } = useSelector((state) => state.misc);
  const { loading } = useSelector((state) => state.chat);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [data, setData] = useState("");

  useEffect(() => {
    async function getFriends() {
      const data = await getMyFriends();
      console.log(data);
      setData(data);
    }
    getFriends();
  }, []);

  console.log(data);

  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  const submitHandler = async () => {
    if (!groupName) return toast.error("Group name is required");

    if (selectedMembers.length < 2)
      return toast.error("Please Select At Least 3 Members");

    const res = dispatch(
      newGroupChat({
        name: groupName,
        members: selectedMembers,
      })
    );
    navigate("/");

    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };

  const handleClickOutside = (e) => {
    if (e.target.id === "modal-backdrop") closeHandler();
  };

  return (
    <div
      id="modal-backdrop"
      onClick={handleClickOutside}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md ${
        isNewGroup ? "block" : "hidden"
      }`}
    >
      <div
        className="bg-white p-8 w-96 rounded-lg shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-center text-2xl font-bold mb-6">New Group</h2>

        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
        />

        <p className="text-lg font-medium">Members</p>

        <div className="max-h-40 overflow-y-auto mb-4">
          {data?.friends?.map((i) => (
            <UserItem
              user={i}
              key={i._id}
              handler={selectMemberHandler}
              isAdded={selectedMembers.includes(i._id)}
            />
          ))}
        </div>

        <div className="flex justify-evenly">
          <button
            onClick={closeHandler}
            className="text-red-500 py-2 px-6 rounded-md hover:bg-red-100"
          >
            Cancel
          </button>
          <button
            onClick={submitHandler}
            className={`py-2 px-6 bg-blue-500 text-white rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewGroup;
