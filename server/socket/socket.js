import { Server } from "socket.io";
import { v4 as uuid } from "uuid";
import { MessageModel } from "../models/messageModel.js";
import {
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  ONLINE_USERS,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events.js";
import { userSocketIDs } from "../app.js";
import { socketAuthenticator } from "../middleware/auth.js";
import cookieParser from "cookie-parser";
import { corsOptions } from "../config/cors.js";
import { getSockets } from "../utils/helper.js";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: corsOptions,
  });

  const onlineUsers = new Set();

  io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, async (err) => {
      if (err) return next(err);
      await socketAuthenticator(socket, next);
    });
  });

  io.on("connection", (socket) => {
    const user = socket.user;

    console.log({ user: user._id, socket: socket.id });

    userSocketIDs.set(user._id.toString(), socket.id);

    socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
      const messageForRealTime = {
        content: message,
        _id: uuid(),
        sender: {
          _id: user._id,
          name: user.name,
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      console.log(messageForRealTime);
      const messageForDB = {
        content: message,
        sender: user._id,
        chat: chatId,
      };

      const membersSocket = getSockets(members);

      membersSocket.forEach((socketId) => {
        io.to(socketId).emit(NEW_MESSAGE, {
          chatId,
          message: messageForRealTime,
        });

        io.to(socketId).emit(NEW_MESSAGE_ALERT, { chatId });
      });

      try {
        await MessageModel.create(messageForDB);
      } catch (error) {
        throw new Error(error);
      }
    });

    socket.on(START_TYPING, ({ members, chatId }) => {
      const membersSockets = getSockets(members);
      console.log(membersSockets);
      socket.to(membersSockets).emit(START_TYPING, { chatId });
    });

    socket.on(STOP_TYPING, ({ members, chatId }) => {
      const membersSockets = getSockets(members);
      socket.to(membersSockets).emit(STOP_TYPING, { chatId });
    });

    socket.on(CHAT_JOINED, ({ userId, members }) => {
      onlineUsers.add(userId.toString());

      const membersSocket = getSockets(members);
      io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
    });

    socket.on(CHAT_LEAVED, ({ userId, members }) => {
      onlineUsers.delete(userId.toString());

      const membersSocket = getSockets(members);
      io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
    });

    socket.on("disconnect", () => {
      userSocketIDs.delete(user._id.toString());
      onlineUsers.delete(user._id.toString());
      socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
    });
  });

  return io;
};
