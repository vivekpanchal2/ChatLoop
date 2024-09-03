import uploadFilesToCloudinary from "../services/fileUpload.js";
import deletFilesFromCloudinary from "../services/fileDelete.js";
import { ChatModel } from "../models/chatModel.js";
import { MessageModel } from "../models/messageModel.js";
import { UserModel } from "../models/userModel.js";
import { getOtherMember } from "../utils/helper.js";
import { emitEvent } from "../utils/features.js";

import {
  ALERT,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../constants/events.js";

export const newGroupChat = async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const allMembers = [...members, req.user];

    console.log(allMembers);

    const chat = await ChatModel.create({
      name,
      groupChat: true,
      creator: req.user,
      members: allMembers,
    });
    console.log(chat);

    emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
    emitEvent(req, REFETCH_CHATS, members);

    return res.status(200).json({
      success: true,
      message: "Group Created",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating Group",
    });
  }
};

//-------------------------------------------------------------------------------

export const getMyChats = async (req, res) => {
  try {
    const chats = await ChatModel.find({ members: req.user }).populate(
      "members",
      "name avatar"
    );

    const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
      const otherMember = getOtherMember(members, req.user);

      return {
        _id,
        groupChat,
        avatar: groupChat
          ? members.slice(0, 3).map(({ avatar }) => avatar.url)
          : [otherMember.avatar.url],
        name: groupChat ? name : otherMember.name,
        members: members.reduce((prev, curr) => {
          if (curr._id.toString() !== req.user.toString()) {
            prev.push(curr._id);
          }
          return prev;
        }, []),
      };
    });

    return res.status(200).json({
      success: true,
      chats: transformedChats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching Chats",
      error,
    });
  }
};

//-------------------------------------------------------------------------------

export const getMyGroups = async (req, res) => {
  try {
    const chats = await ChatModel.find({
      members: req.user,
      groupChat: true,
      creator: req.user,
    }).populate("members", "name avatar");

    const groups = chats.map(({ members, _id, groupChat, name }) => ({
      _id,
      groupChat,
      name,
      avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
    }));

    return res.status(200).json({
      success: true,
      groups,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while Getiing Groups",
    });
  }
};

//-------------------------------------------------------------------------------

export const addMember = async (req, res) => {
  try {
    const { chatId, members } = req.body;

    if (!chatId || !members || !Array.isArray(members)) {
      return res.status(400).json({
        success: false,
        message: "Chat ID and members list are required",
      });
    }

    const chat = await ChatModel.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat Not Found",
      });
    }

    if (!chat.groupChat) {
      return res.status(400).json({
        success: false,
        message: "This is not group chat",
      });
    }

    if (chat.creator.toString() !== req.user.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to add members",
      });
    }

    const allNewMembersPromise = members.map((i) =>
      UserModel.findById(i, "name")
    );

    const allNewMembers = await Promise.all(allNewMembersPromise);

    console.log("All Members : ", allNewMembers);

    const uniqueMembers = allNewMembers
      .filter((i) => !chat.members.includes(i._id.toString()))
      .map((i) => i._id);

    chat.members.push(...uniqueMembers);

    if (chat.members.length > 30)
      return res.status(409).json({
        success: false,
        message: "Group Member Limit",
      });

    await chat.save();

    const allUsersName = allNewMembers.map((i) => i.name).join(", ");

    console.log(allUsersName);

    emitEvent(
      req,
      ALERT,
      chat.members,
      `${allUsersName} has been added in the group`
    );
    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
      success: true,
      message: "Members added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while Adding Member",
      error,
    });
  }
};

//-------------------------------------------------------------------------------

export const removeMember = async (req, res) => {
  try {
    const { userId, chatId } = req.body;

    if (!userId || !chatId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Chat ID are required",
      });
    }

    const [chat, userThatWillRemoved] = await Promise.all([
      ChatModel.findById(chatId),
      UserModel.findById(userId),
    ]);

    console.log({ userId, userThatWillRemoved });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat Not Found",
      });
    }

    if (!chat.groupChat) {
      return res.status(400).json({
        success: false,
        message: "This is not group chat",
      });
    }

    if (!userThatWillRemoved) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (chat.creator.toString() !== req.user.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to Remove members",
      });
    }

    const isMember = chat.members.includes(userId.toString());
    if (!isMember) {
      return res.status(400).json({
        success: false,
        message: "User is not a member of this group",
      });
    }

    if (chat.members.length <= 3) {
      return res.status(403).json({
        success: false,
        message: "Group Should have atleast three member",
      });
    }

    const allChatMembers = chat.members.map((i) => i.toString());

    console.log(allChatMembers);

    chat.members = chat.members.filter(
      (member) => member.toString() !== userId.toString()
    );

    await chat.save();

    emitEvent(req, ALERT, chat.members, {
      message: `${userThatWillRemoved.name} has been removed from the group`,
      chatId,
    });

    emitEvent(req, REFETCH_CHATS, allChatMembers);

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while removing member",
      error,
    });
  }
};

//-------------------------------------------------------------------------------

export const leaveGroup = async (req, res) => {
  try {
    const chatId = req.params.id;

    console.log(req.params);
    console.log(chatId);

    const chat = await ChatModel.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat Not Found",
      });
    }

    if (!chat.groupChat) {
      return res.status(400).json({
        success: false,
        message: "This is not group chat",
      });
    }

    const remainingMembers = chat.members.filter(
      (member) => member.toString() !== req.user.toString()
    );

    if (remainingMembers.length < 3) {
      return res.status(403).json({
        success: false,
        message: "Group Should have atleast three member",
      });
    }

    if (chat.creator.toString() === req.user.toString()) {
      const randomElement = Math.floor(Math.random() * remainingMembers.length);
      const newCreator = remainingMembers[randomElement];
      chat.creator = newCreator;
    }

    chat.members = remainingMembers;

    const [user] = await Promise.all([
      UserModel.findById(req.user, "name"),
      chat.save(),
    ]);

    emitEvent(req, ALERT, chat.members, {
      chatId,
      message: `User ${user.name} has left the group`,
    });

    return res.status(200).json({
      success: true,
      message: "Leave Group Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while leaving member",
      error,
    });
  }
};

//-------------------------------------------------------------------------------

export const sendAttachments = async (req, res) => {
  try {
    const { chatId } = req.body;

    const files = req.files || [];

    console.log({ files, chatId });

    if (files.length < 1) {
      return res.status(400).json({
        success: false,
        message: "Please Provide atleast one attachment",
      });
    }
    if (files.length > 5) {
      return res.status(400).json({
        success: false,
        message: "Files Can't be more than 5",
      });
    }

    const [chat, me] = await Promise.all([
      ChatModel.findById(chatId),
      UserModel.findById(req.user, "name"),
    ]);

    console.log({ chat, me });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat Not Found",
      });
    }

    const attachments = await uploadFilesToCloudinary(files);

    console.log(attachments);

    const messageForDB = {
      content: "",
      attachments,
      sender: me._id,
      chat: chatId,
    };

    const message = await MessageModel.create(messageForDB);

    const messageForRealTime = {
      ...messageForDB,
      sender: {
        _id: me._id,
        name: me.name,
      },
    };

    emitEvent(req, NEW_MESSAGE, chat.members, {
      message: messageForRealTime,
      chatId,
    });

    emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "something went wrong while sending attachments ",
      error,
    });
  }
};

//-------------------------------------------------------------------------

// if populate true then it will populate the member details
export const getChatDetails = async (req, res, next) => {
  try {
    if (req.query.populate === "true") {
      const chat = await ChatModel.findById(req.params.id)
        .populate("members", "name avatar")
        .lean();

      if (!chat) {
        return res.status(404).json({
          success: false,
          message: "Chat Not Found",
        });
      }

      chat.members = chat.members.map(({ _id, name, avatar }) => ({
        _id,
        name,
        avatar: avatar.url,
      }));

      return res.status(200).json({
        success: true,
        chat,
      });
    } else {
      const chat = await ChatModel.findById(req.params.id);
      if (!chat) {
        return res.status(404).json({
          success: false,
          message: "Chat Not Found",
        });
      }

      return res.status(200).json({
        success: true,
        chat,
      });
    }
  } catch (error) {
    console.log("Error while geting chats", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching chat details",
    });
  }
};

//---------------------------------------------------------------------------

export const renameGroup = async (req, res) => {
  try {
    const chatId = req.params.id;
    console.log(req.body);
    const { name } = req.body;

    if (!chatId || !name) {
      return res.status(404).json({
        success: false,
        message: "ChatId or name is missing",
      });
    }

    const chat = await ChatModel.findById(chatId);

    console.log({ chatId, chat });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat Not Found",
      });
    }

    if (!chat.groupChat) {
      return res.status(400).json({
        success: false,
        message: "Chat is not group-chat",
      });
    }

    if (chat.creator.toString() !== req.user.toString()) {
      return res.status(400).json({
        success: false,
        message: "You are not allowed to change the name of group",
      });
    }

    chat.name = name;

    await chat.save();

    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
      success: true,
      message: "Group renamed successfully",
    });
  } catch (error) {
    console.log("Error while rename the group", error);
    return res.status(500).json({
      success: false,
      message: "Error while renaming the group",
    });
  }
};

//---------------------------------------------------------------------------

export const deleteChat = async (req, res) => {
  try {
    const chatId = req.params.id;

    const chat = await ChatModel.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat Not Found",
      });
    }

    const members = chat.members;

    if (!chat.groupChat) {
      return res.status(400).json({
        success: false,
        message: "This is not group chat",
      });
    }

    if (
      !chat.members.includes(req.user.toString()) ||
      chat.creator.toString() !== req.user.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to Delete group",
      });
    }

    const messagesWithAttachments = await MessageModel.find({
      chat: chatId,
      attachments: { $exists: true, $ne: [] },
    });

    const public_ids = [];

    messagesWithAttachments.forEach(({ attachments }) =>
      attachments.forEach(({ public_id }) => public_ids.push(public_id))
    );

    await Promise.all([
      deletFilesFromCloudinary(public_ids),
      chat.deleteOne(),
      MessageModel.deleteMany({ chat: chatId }),
    ]);

    emitEvent(req, REFETCH_CHATS, members);

    return res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.log("Error while delete the group", error);
    return res.status(500).json({
      success: false,
      message: "Error while delete the group",
    });
  }
};

// ------------------------------------------------------------------------

export const getMessages = async (req, res, next) => {
  try {
    const chatId = req.params.id;
    const { page = 1 } = req.query;

    const resultPerPage = 20;
    const skip = (page - 1) * resultPerPage;

    const chat = await ChatModel.findById(chatId);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    if (!chat.members.includes(req.user.toString()))
      return next(
        new ErrorHandler("You are not allowed to access this chat", 403)
      );

    const [messages, totalMessagesCount] = await Promise.all([
      MessageModel.find({ chat: chatId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(resultPerPage)
        .populate("sender", "name")
        .lean(),
      MessageModel.countDocuments({ chat: chatId }),
    ]);

    const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;

    return res.status(200).json({
      success: true,
      messages: messages.reverse(),
      totalPages,
    });
  } catch (error) {
    console.log("Error while delete the group", error);
    return res.status(500).json({
      success: false,
      message: "Error while gettting the messages",
    });
  }
};
