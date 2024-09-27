import { getSockets } from "./helper.js";
import { userSocketIDs } from "../app.js";

const emitEvent = (req, event, users, data) => {
  const io = req.app.get("io");

  const usersSocket = getSockets(users);

  console.log("event emited for ", usersSocket);

  io.to(usersSocket).emit(event, data);
};

export { emitEvent };
