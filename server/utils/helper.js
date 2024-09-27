import { userSocketIDs } from "../app.js";

export const getSockets = (users = []) => {
  console.log({ users, userSocketIDs });

  // Check if users array contains objects or strings
  const sockets = users.map((user) => {
    // If user is an object, use user._id, otherwise use the user directly
    const userId = typeof user === "object" ? user._id : user;
    return userSocketIDs.get(userId);
  });

  return sockets;
};

export const getBase64 = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

export const getOtherMember = (members, userId) =>
  members.find((member) => member._id.toString() !== userId.toString());
