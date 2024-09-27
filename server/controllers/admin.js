const adminSecretKey = process.env.ADMIN_SECRET_KEY || "lord";

import { ChatModel } from "../models/chatModel.js";
import { MessageModel } from "../models/messageModel.js";
import { UserModel } from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {
    const { secretKey } = req.body;

    const isMatched = secretKey === adminSecretKey;

    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid key",
      });
    }

    const token = jwt.sign({ secretKey }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie("token", token, options).status(201).json({
      success: true,
      token,
      message: "Admin Access Granted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("token", { path: "/" });

    return res.status(200).json({
      success: true,
      message: "Admin LogOut Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const getAdminData = async (req, res) => {
  try {
    return res.status(200).json({
      admin: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({});

    const transformedUsers = await Promise.all(
      users.map(async ({ name, username, avatar, _id }) => {
        const groups = ChatModel.countDocuments({
          groupChat: true,
          members: _id,
        });
        const friends = ChatModel.countDocuments({
          groupChat: false,
          members: _id,
        });

        return {
          name,
          username,
          avatar: avatar.url, // Only include the URL of the avatar
          _id,
          groups: await groups,
          friends: await friends,
        };
      })
    );
    return res.status(200).json({
      success: "true",
      users: transformedUsers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const getAllChats = async (req, res) => {
  try {
    const chats = await ChatModel.find({})
      .populate("members", "name avatar")
      .populate("creator", "name avatar");

    const transformedChats = await Promise.all(
      chats.map(async ({ members, _id, groupChat, name, creator }) => {
        const totalMessages = await MessageModel.countDocuments({ chat: _id });

        return {
          _id,
          groupChat,
          name,
          avatar: members.slice(0, 3).map((member) => member.avatar.url),
          members: members.map(({ _id, name, avatar }) => ({
            _id,
            name,
            avatar: avatar.url,
          })),
          creator: {
            name: creator?.name || "-",
            avatar: creator?.avatar.url || "-",
          },
          totalMembers: members.length,
          totalMessages,
        };
      })
    );

    console.log("Hereeeeeeeeeeee");

    return res.status(200).json({
      success: true,
      chats: transformedChats,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const messages = await MessageModel.find({})
      .populate("sender", "name avatar")
      .populate("chat", "groupChat");

    console.log(messages.length);

    const transformedMessages = messages.map(
      ({ content, attachments, _id, sender, createdAt, chat }) => ({
        _id,
        attachments,
        content,
        createdAt,
        chat: chat?._id,
        groupChat: chat?.groupChat,
        sender: {
          _id: sender?._id,
          name: sender?.name,
          avatar: sender?.avatar?.url,
        },
      })
    );

    console.log(transformedMessages);

    return res.status(200).json({
      success: true,
      messages: transformedMessages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [groupsCount, usersCount, messagesCount, totalChatsCount] =
      await Promise.all([
        ChatModel.countDocuments({ groupChat: true }),
        UserModel.countDocuments(),
        MessageModel.countDocuments(),
        ChatModel.countDocuments(),
      ]);

    const today = new Date();

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const last7DaysMessages = await MessageModel.find({
      createdAt: {
        $gte: last7Days,
        $lte: today,
      },
    }).select("createdAt");

    const messages = new Array(7).fill(0);
    const dayInMiliseconds = 1000 * 60 * 60 * 24;

    last7DaysMessages.forEach((message) => {
      const indexApprox =
        (today.getTime() - message.createdAt.getTime()) / dayInMiliseconds;
      const index = Math.floor(indexApprox);

      messages[6 - index]++;
    });

    const stats = {
      groupsCount,
      usersCount,
      messagesCount,
      totalChatsCount,
      messagesChart: messages,
    };

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};
