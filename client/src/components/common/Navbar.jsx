import React, { Suspense, lazy, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaUsers,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";

import { FaBars } from "react-icons/fa6";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import IconBtn from "../core/Navbar/IconBtn";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../../redux/slices/auth";

const Navbar = () => {
  const handleMobile = () => {
    console.log("Mobile");
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const openSearch = () => console.log("Search open");

  const openNewGroup = () => console.log("New Group");

  //   const notificationCount = 10;
  const openNotification = () => console.log("Notifications");

  const navigateToGroup = () => {
    console.log("Navigate to groups");
    navigate("./groups");
  };

  const logoutHandler = async () => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <>
      <div className="flex h-16 bg-richblack-900 ">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <h1 className=" sm:block text-white text-xl">ChatLoop</h1>

          <div className="block sm:hidden">
            <IconBtn title="Menu" icon={<FaBars />} onClick={handleMobile} />
          </div>

          <div className="hidden space-x-8 sm:flex">
            <IconBtn title="Search" icon={<FaSearch />} onClick={openSearch} />
            <IconBtn
              title="New Group"
              icon={<FaPlus />}
              onClick={openNewGroup}
            />
            <IconBtn
              title="Manage Groups"
              icon={<FaUsers />}
              onClick={navigateToGroup}
            />
            <IconBtn
              title="Notifications"
              icon={<FaBell />}
              onClick={openNotification}
              value={10}
            />
            <IconBtn
              title="Logout"
              icon={<FaSignOutAlt />}
              onClick={logoutHandler}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
