import React, { useState } from "react";
import { Link as LinkComponent, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../services/operations/admin";

import { IoMdCloseCircle as CloseIcon } from "react-icons/io";
import { MdSpaceDashboard as DashboardIcon } from "react-icons/md";
import { IoMdExit as ExitToAppIcon } from "react-icons/io";
import { MdGroups as GroupsIcon } from "react-icons/md";
import { MdManageAccounts as ManageAccountsIcon } from "react-icons/md";
import { IoMdMenu as MenuIcon } from "react-icons/io";
import { MdMessage as MessageIcon } from "react-icons/md";

const Link = ({ to, children, onClick, active }) => (
  <LinkComponent
    to={to}
    onClick={onClick}
    className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-300
      ${
        active
          ? "bg-richblack-500 text-white"
          : "text-gray-700 hover:bg-gray-200"
      }`}
  >
    {children}
  </LinkComponent>
);

const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <ManageAccountsIcon />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <GroupsIcon />,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <MessageIcon />,
  },
];

const Sidebar = ({ w = "100%" }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(adminLogout());
  };

  return (
    <div className={`w-${w} p-6 space-y-6 bg-gray-100 shadow-lg`}>
      <h1 className="text-3xl font-bold text-indigo-600">ChatX</h1>
      <div className="space-y-3">
        {adminTabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            active={location.pathname === tab.path}
          >
            {tab.icon}
            <span className="ml-3">{tab.name}</span>
          </Link>
        ))}
        <Link onClick={logoutHandler}>
          <ExitToAppIcon />
          <span className="ml-3">Logout</span>
        </Link>
      </div>
    </div>
  );
};

const AdminLayout = ({ children }) => {
  const { isAdmin } = useSelector((state) => state.auth);

  const [isMobile, setIsMobile] = useState(false);

  const handleMobile = () => setIsMobile(!isMobile);
  const handleClose = () => setIsMobile(false);

  if (!isAdmin) return <Navigate to="/admin" />;

  return (
    <div className="flex min-h-screen">
      <div className="block md:hidden fixed right-4 top-4">
        <button onClick={handleMobile} className="p-2 text-gray-700">
          {isMobile ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div className="hidden md:block md:w-1/4 lg:w-1/5 bg-white shadow-md">
        <Sidebar />
      </div>

      <div className="flex-1 bg-gray-50 p-8">{children}</div>

      {isMobile && (
        <div className="fixed inset-0 bg-white shadow-lg z-50">
          <Sidebar w="2/3" />
          <button onClick={handleClose} className="absolute top-4 right-4 p-2">
            <CloseIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
