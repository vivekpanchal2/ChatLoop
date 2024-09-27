import React, { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaUsers,
  FaSignOutAlt,
  FaBell,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Notifications from "../specific/Notifications";
import {
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/slices/misc";
import { setToken, setUser } from "../../redux/slices/auth";
import { resetNotificationCount } from "../../redux/slices/chat";
import Search from "../specific/Search";
import NewGroup from "../specific/NewGroup";
import IconBtn from "../core/Navbar/IconBtn";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openSearch = () => dispatch(setIsSearch(true));
  const openNewGroup = () => dispatch(setIsNewGroup(true));

  const { isNotification } = useSelector((state) => state.misc);
  const { notificationCount } = useSelector((state) => state.chat);
  const { isSearch, isNewGroup } = useSelector((state) => state.misc);

  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  const navigateToGroup = () => {
    navigate("/groups");
  };

  const logoutHandler = async () => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="flex items-center justify-between w-full h-16 px-4 bg-richblack-900 shadow-md sm:px-6 lg:px-8">
        <h1
          className="text-xl text-white cursor-pointer hover:text-richblack-100 transition duration-200"
          onClick={() => navigate("/")}
        >
          ChatX
        </h1>

        <div className="block sm:hidden">
          <button onClick={toggleMobileMenu} className="text-white">
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        <div className="hidden space-x-6 sm:flex sm:items-center">
          <IconBtn title="Search" icon={<FaSearch />} onClick={openSearch} />
          <IconBtn title="New Group" icon={<FaPlus />} onClick={openNewGroup} />
          <IconBtn
            title="Manage Groups"
            icon={<FaUsers />}
            onClick={navigateToGroup}
          />
          <IconBtn
            title="Notifications"
            icon={<FaBell />}
            onClick={openNotification}
            value={notificationCount}
          />
          <IconBtn
            title="Logout"
            icon={<FaSignOutAlt />}
            onClick={logoutHandler}
          />
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-richblack-900 z-50 flex flex-col items-center space-y-4 py-4 sm:hidden text-white">
          <button onClick={openSearch} className="flex items-center space-x-2">
            <FaSearch size={20} />
            <span>Search</span>
          </button>
          <button
            onClick={openNewGroup}
            className="flex items-center space-x-2"
          >
            <FaPlus size={20} />
            <span>New Group</span>
          </button>
          <button
            onClick={navigateToGroup}
            className="flex items-center space-x-2"
          >
            <FaUsers size={20} />
            <span>Manage Groups</span>
          </button>
          <button
            onClick={openNotification}
            className="relative flex items-center space-x-2"
          >
            <FaBell size={20} />
            <span>Notifications</span>
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 text-xs bg-red-600 rounded-full">
                {notificationCount}
              </span>
            )}
          </button>
          <button
            onClick={logoutHandler}
            className="flex items-center space-x-2"
          >
            <FaSignOutAlt size={20} />
            <span>Logout</span>
          </button>
        </div>
      )}

      {isNotification && (
        <div className="absolute inset-0 z-50 bg-opacity-75 bg-black">
          <Notifications />
        </div>
      )}

      {isSearch && (
        <div className="absolute inset-0 z-50 bg-opacity-75 bg-black">
          <Search />
        </div>
      )}

      {isNewGroup && (
        <div className="absolute inset-0 z-50 bg-opacity-75 bg-black">
          <NewGroup />
        </div>
      )}
    </>
  );
};

export default Navbar;
