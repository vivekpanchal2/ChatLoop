const BASE_URL = "http://localhost:3000/api/v1";

export const endpoints = {
  LOGIN_API: BASE_URL + "/user/login",
  SIGNUP_API: BASE_URL + "/user/signUp",
};

export const adminEndPoints = {
  ADMIN_LOGIN: BASE_URL + "/admin/adminLogin",
  GET_DASHBOARD_STATE: BASE_URL + "/admin/getDashboardStats",
  GET_ADMIN: BASE_URL + "/admin/getAdminData",
  ADMIN_LOGOUT: BASE_URL + "/admin/adminLogout",
  ADMIN_ALL_CHATS: BASE_URL + "/admin/getAllChats",
  ADMIN_ALL_MESSAGES: BASE_URL + "/admin/getAllMessages",
  ADMIN_ALL_USER: BASE_URL + "/admin/getAllUsers",
};

export const chatEndPoints = {
  GET_MY_CHATS: BASE_URL + "/chat/getMyChats",
  GET_MESSAGES: BASE_URL + "/chat/getMessage",
  GET_CHAT_DETAILS: BASE_URL + "/chat",
  DELETE_CHAT: BASE_URL + "/chat/deleteChat",
  SEND_ATTACHMENTS: BASE_URL + "/chat/sendAttachments",
  NEW_GROUP_CHAT: BASE_URL + "/chat/newGroupChat",
  GET_MY_GROUPS: BASE_URL + "/chat/getMyGroups",
  REMOVE_GROUP_MEMBER: BASE_URL + "/chat/removeMember",
  ADD_GROUP_MEMBER: BASE_URL + "/chat/addMember",
  RENAME_GROUP: BASE_URL + "/chat/renameGroup",
  LEAVE_GROUP: BASE_URL + "/chat/leaveGroup",
};

export const friendEndPoints = {
  SEARCH_USER: BASE_URL + "/user/searchUser",
  SEND_FRIEND_REQUEST: BASE_URL + "/user/sendFriendRequest",
  GET_NOTIFICATIONS: BASE_URL + "/user/getMyNotifications",
  ACCEPT_FRIEND_REQUEST: BASE_URL + "/user/acceptFriendRequest",
  CANCEL_SEND_FRIEND_REQUEST: BASE_URL + "/user/cancelSendFriendRequest",
  GET_MY_FRIENDS: BASE_URL + "/user/getMyFriends",
};
