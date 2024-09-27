import toast from "react-hot-toast";
import { chatEndPoints } from "../apis";
import { apiConnector } from "../apiconnector";
import { setLoading } from "../../redux/slices/chat";
const {
  GET_MY_CHATS,
  GET_MESSAGES,
  GET_CHAT_DETAILS,
  DELETE_CHAT,
  SEND_ATTACHMENTS,
  LEAVE_GROUP,
} = chatEndPoints;

export function getMyChats() {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("GET", GET_MY_CHATS, {}, {}, {});

      console.log("api response", response);

      return response;
    } catch (error) {
      console.error("getMyChats API ERROR:", error);
      toast.error(
        `ChatList  Fetching error: ${
          error.message || "An unexpected error occurred"
        }`
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export async function getMessages(chatId, page) {
  try {
    const response = await apiConnector(
      "GET",
      `${GET_MESSAGES}/${chatId}`,
      {},
      { page },
      {}
    );
    return response;
  } catch (error) {
    console.error("getMessages API ERROR:", error);
    toast.error(
      `Messages Fetching error: ${
        error.message || "An unexpected error occurred"
      }`
    );
  }
}

export const getChatDetails = async (chatId) => {
  try {
    const response = await apiConnector(
      "GET",
      `${GET_CHAT_DETAILS}/${chatId}?populate=true`,
      {},
      {},
      {}
    );
    return response;
  } catch (error) {
    console.error("getChatDetails API ERROR:", error);
    toast.error(
      `Chat Fetching error: ${error.message || "An unexpected error occurred"}`
    );
  }
};

export const deleteChat = async (id) => {
  try {
    console.log(id);
    const response = await apiConnector(
      "DELETE",
      `${DELETE_CHAT}/${id}`,
      {},
      { id },
      {}
    );
    return response;
  } catch (error) {
    console.error("getChatDetails API ERROR:", error);
    toast.error(
      `Chat Fetching error: ${error.message || "An unexpected error occurred"}`
    );
  }
};

export const leaveGroup = async (id) => {
  try {
    console.log(id);
    const response = await apiConnector(
      "DELETE",
      `${LEAVE_GROUP}/${id}`,
      {},
      { id },
      {}
    );
    return response;
  } catch (error) {
    console.error("Leave Group API ERROR:", error);
    toast.error(
      ` ${error.response.data.message || "An unexpected error occurred"}`
    );
  }
};

export const sendAttachments = async (myForm) => {
  try {
    const response = await apiConnector(
      "POST",
      SEND_ATTACHMENTS,
      myForm,
      {},
      {}
    );
    return response;
  } catch (error) {
    console.error("getChatDetails API ERROR:", error);
    toast.error(
      `Chat Fetching error: ${error.message || "An unexpected error occurred"}`
    );
  }
};
