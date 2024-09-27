import uploadFilesToCloudinary from "../services/fileUpload.js";
import { UserModel } from "../models/userModel.js";
import { ChatModel } from "../models/chatModel.js";
import { RequestModel } from "../models/requestModel.js";
import { emitEvent } from "../utils/features.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    console.log(req.file);
    console.log(req.body);

    const { name, username, email, password, bio } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an avatar",
      });
    }

    const emailExists = await UserModel.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const usernameExists = await UserModel.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this username",
      });
    }

    const uploadedFile = await uploadFilesToCloudinary([file]);

    const avatar = {
      public_id: uploadedFile[0].public_id,
      url: uploadedFile[0].url,
    };

    const user = await UserModel.create({
      name,
      bio,
      username,
      email,
      password,
      avatar,
    });

    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie("token", token, options).status(201).json({
      success: true,
      token,
      user,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { validator, password } = req.body;

    console.log(req.body);

    if (!validator || !password) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await UserModel.findOne({
      $or: [{ email: validator }, { username: validator }],
    }).select("+password");

    console.log(user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      }
    );

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie("token", token, options).status(201).json({
      success: true,
      token,
      user,
      message: "User Login successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", { path: "/" });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//----------------------------------------------------------------------

export const getMyProfile = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user);

    if (!user) return next(new ErrorHandler("User not found", 404));

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while profile fetch",
    });
  }
};

// -----------------------------------------------------------------------------------------------

export const searchUser = async (req, res) => {
  try {
    const { name = "" } = req.query;

    console.log({ name, me: req.user });

    const myChats = await ChatModel.find({
      groupChat: false,
      members: req.user,
    });

    const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

    const excludedUsers = [...allUsersFromMyChats, req.user];

    const allUsersExceptMeAndFriends = await UserModel.find({
      _id: { $nin: excludedUsers },
      name: { $regex: name, $options: "i" },
    });

    // console.log(allUsersExceptMeAndFriends);

    const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    // console.log(users);

    const pendingRequest = await RequestModel.find({
      sender: req.user,
    }).select("receiver");

    return res.status(200).json({
      success: true,
      users,
      pendingRequest,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//--------------------------------------------------------------------

export const sendFriendRequest = async (req, res, next) => {
  try {
    const { userId } = req.body;

    console.log(req.body);
    console.log(userId);

    const request = await RequestModel.findOne({
      $or: [
        { sender: req.user, receiver: userId },
        { sender: userId, receiver: req.user },
      ],
    });

    if (request) {
      return res.status(400).json({
        success: false,
        message: "Request is already sent",
      });
    }

    await RequestModel.create({
      sender: req.user,
      receiver: userId,
    });

    emitEvent(req, NEW_REQUEST, [userId]);

    return res.status(200).json({
      success: true,
      message: "Friend Request Sent",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//--------------------------------------------------------------------

export const cancelSendFriendRequest = async (req, res, next) => {
  try {
    const { userId } = req.body;

    console.log(userId);

    if (!userId) {
      res.status(404).json({
        success: false,
        message: "User Id is required",
      });
    }

    const request = await RequestModel.findOneAndDelete({
      sender: req.user,
      receiver: userId,
    });
    console.log(request);

    return res.status(200).json({
      success: true,
      message: "Friend Request cancelled successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//---------------------------------------------------------------------

export const acceptFriendRequest = async (req, res, next) => {
  try {
    const { requestId, accept } = req.body;

    console.log(req.body);

    const request = await RequestModel.findById(requestId)
      .populate("sender", "name")
      .populate("receiver", "name");

    console.log(request);

    if (!request)
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });

    if (request.receiver._id.toString() !== req.user.toString())
      return next(
        new ErrorHandler("You are not authorized to accept this request", 401)
      );

    if (!accept) {
      await request.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Friend Request Rejected",
      });
    }

    const members = [
      request.sender._id.toString(),
      request.receiver._id.toString(),
    ];

    await Promise.all([
      ChatModel.create({
        members,
        name: `${request.sender.name}-${request.receiver.name}`,
      }),
      request.deleteOne(),
    ]);

    emitEvent(req, REFETCH_CHATS, members);

    return res.status(200).json({
      success: true,
      message: "Friend Request Accepted",
      senderId: request.sender._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// -----------------------------------------------------------------------------------------------

export const getMyNotifications = async (req, res) => {
  try {
    const requests = await RequestModel.find({ receiver: req.user }).populate(
      "sender",
      "name avatar"
    );

    console.log(requests);

    const allRequests = requests.map(({ _id, sender }) => ({
      _id,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
    }));

    return res.status(200).json({
      success: true,
      allRequests,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// -----------------------------------------------------------------------------------------------

export const getMyFriends = async (req, res) => {
  try {
    const chatId = req.query.chatId;

    const chats = await ChatModel.find({
      members: req.user,
      groupChat: false,
    }).populate("members", "name avatar");

    const friends = chats.map(({ members }) => {
      const getOtherMember = (members, userId) =>
        members.find((member) => member._id.toString() !== userId.toString());

      console.log(getOtherMember);

      const otherUser = getOtherMember(members, req.user);

      console.log(otherUser);

      return {
        _id: otherUser._id,
        name: otherUser.name,
        avatar: otherUser.avatar.url,
      };
    });

    if (chatId) {
      const chat = await ChatModel.findById(chatId);

      const availableFriends = friends.filter(
        (friend) => !chat.members.includes(friend._id)
      );

      return res.status(200).json({
        success: true,
        friends: availableFriends,
      });
    } else {
      return res.status(200).json({
        success: true,
        friends,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
