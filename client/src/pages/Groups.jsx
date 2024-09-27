import React, { Suspense, lazy, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getChatDetails, deleteChat } from "../services/operations/chat";
import {
  getMyGroups,
  removeGroupMember,
  renameGroup,
} from "../services/operations/groups";
import { setIsAddMember } from "../redux/slices/misc";
import { LayoutLoader } from "../components/layout/Loaders";
import AvatarCard from "../components/shared/AvatarCard";
import UserItem from "../components/shared/UserItem";
import {
  IoMenu,
  IoAddCircleSharp,
  IoCheckmarkDoneCircle,
} from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import Navbar from "../components/common/Navbar";
import { MdDelete, MdKeyboardBackspace } from "react-icons/md";
import toast from "react-hot-toast";

// const ConfirmDeleteDialog = lazy(() =>
//   import("../components/dialogs/ConfirmDeleteDialog")
// );
import ConfirmDeleteDialog from "../components/dialogs/ConfirmDeleteDialog";

const AddMemberDialog = lazy(() =>
  import("../components/dialogs/AddMemberDialog")
);

const Groups = () => {
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("group");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddMember } = useSelector((state) => state.misc);

  const [groupDetails, setGroupDetails] = useState(null);
  const [loadingGroupDetails, setLoadingGroupDetails] = useState(false);
  const [myGroups, setMyGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [members, setMembers] = useState([]);
  const [creator, setCreator] = useState([]);

  useEffect(() => {
    fetchGroups();
  }, [dispatch]);

  useEffect(() => {
    getGroupDetailsData();
  }, [chatId]);

  const fetchGroups = async () => {
    setLoadingGroups(true);
    try {
      const response = await dispatch(getMyGroups());
      setMyGroups(response?.groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoadingGroups(false);
    }
  };

  async function getGroupDetailsData() {
    if (chatId && !loadingGroupDetails) {
      setLoadingGroupDetails(true);
      const data = await getChatDetails(chatId);
      setGroupDetails(data.chat);
      setLoadingGroupDetails(false);
    }
  }

  useEffect(() => {
    if (groupDetails) {
      setGroupName(groupDetails.name);
      setGroupNameUpdatedValue(groupDetails.name);
      setMembers(groupDetails.members);
      setCreator(groupDetails.creator);
    }
  }, [groupDetails]);

  const navigateBack = () => navigate("/");

  const updateGroupName = async () => {
    setIsEdit(false);
    console.log("in update function");
    const res = await dispatch(
      renameGroup({ chatId, name: groupNameUpdatedValue })
    );
    getGroupDetailsData();
    fetchGroups();
    console.log(res);
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const deleteHandler = async () => {
    try {
      await deleteChat(chatId);
      await fetchGroups();
      closeConfirmDeleteHandler();
      setGroupDetails(null);
      navigate("/groups");
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error("Failed to delete group.");
    }
  };

  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };

  const removeMemberHandler = async (userId) => {
    console.log("Handler", chatId, userId);
    try {
      const res = await dispatch(removeGroupMember({ chatId, userId }));
      console.log(res);
      getGroupDetailsData();
    } catch (error) {
      console.log(error);
    }
  };

  const GroupsList = () => (
    <div className="h-full overflow-y-auto  bg-white border-2">
      {myGroups.length > 0 ? (
        myGroups.map((group) => (
          <GroupListItem key={group._id} group={group} chatId={chatId} />
        ))
      ) : (
        <p className="text-center text-white">No groups available</p>
      )}
    </div>
  );

  const GroupListItem = ({ group, chatId }) => {
    const { name, avatar, _id } = group;
    const navigate = useNavigate();
    const isActive = chatId === _id; // or String comparison if needed

    return (
      <div
        onClick={() => navigate(`?group=${_id}`)}
        className={`block p-4  hover:bg-gray-100 hover:cursor-pointer
          ${isActive ? "bg-blue-100" : ""}`}
      >
        <div className="flex items-center space-x-8">
          <div>{isActive ? "loka" : "Joka"}</div>
          <AvatarCard avatar={avatar} />
          <p className="font-medium">{name}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="h-[calc(100vh-4rem)] flex flex-col sm:flex-row">
        <div className="hidden sm:block sm:w-1/4 bg-blue-300">
          {loadingGroups ? <LayoutLoader /> : <GroupsList />}
        </div>

        <div className="flex-1 bg-white flex flex-col items-center p-4 relative">
          <button onClick={navigateBack} className="absolute top-4 left-4">
            <MdKeyboardBackspace className="text-black w-8 h-8 hover:text-gray-800" />
          </button>

          {groupDetails && (
            <div className="w-full max-w-3xl">
              <div className="flex items-center justify-center space-x-4 mb-6">
                {isEdit ? (
                  <>
                    <input
                      type="text"
                      value={groupNameUpdatedValue}
                      onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={updateGroupName}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      <IoCheckmarkDoneCircle className="w-6 h-6" />
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-semibold">{groupName}</h2>
                    <button
                      onClick={() => setIsEdit(true)}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      <FaEdit className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              <div className="w-full mb-4">
                <h3 className="text-lg font-semibold mb-2">Members</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {members.map((member) => {
                    if (member._id === creator) return;
                    return (
                      <UserItem
                        key={member._id}
                        user={member}
                        handler={() => removeMemberHandler(member._id)}
                        isAdded={true}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="flex space-x-4 mt-4">
                <button
                  onClick={openAddMemberHandler}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <IoAddCircleSharp className="w-6 h-6" />
                  <span className="ml-2">Add Member</span>
                </button>
                <button
                  onClick={openConfirmDeleteHandler}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <MdDelete className="w-6 h-6" />
                  <span className="ml-2">Delete Group</span>
                </button>
              </div>
            </div>
          )}

          {/* Lazy-loaded Modals */}
          {confirmDeleteDialog && (
            <Suspense fallback={<LayoutLoader />}>
              {console.log("Here")}
              {console.log("ConfirmDeleteDialog is lazy-loading")}
              <ConfirmDeleteDialog
                handleClose={closeConfirmDeleteHandler}
                deleteHandler={deleteHandler}
              />
            </Suspense>
          )}
          {isAddMember && (
            <Suspense fallback={<LayoutLoader />}>
              <AddMemberDialog
                chatId={chatId}
                getGroupDetailsData={getGroupDetailsData}
              />
            </Suspense>
          )}
        </div>
      </div>
    </>
  );
};

export default Groups;
