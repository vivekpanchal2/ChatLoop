import toast from "react-hot-toast";
import { friendEndPoints } from "../apis";
import { apiConnector } from "../apiconnector";
import { setLoading } from "../../redux/slices/chat";
const {
  SEARCH_USER,
  SEND_FRIEND_REQUEST,
  GET_NOTIFICATIONS,
  ACCEPT_FRIEND_REQUEST,
  CANCEL_SEND_FRIEND_REQUEST,
  GET_MY_FRIENDS,
} = friendEndPoints;

export function searchUser(name) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("GET", SEARCH_USER, {}, { name }, {});

      console.log("api response", response);

      return response;
    } catch (error) {
      console.error("SEARCH USER API ERROR:", error);
      toast.error(
        `SEARCH  USER error: ${error.message || "An unexpected error occurred"}`
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export const sendFriendRequest = async (userId) => {
  try {
    const response = await apiConnector(
      "POST",
      `${SEND_FRIEND_REQUEST}`,
      { userId },
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

export const cancelSendFriendRequest = async (userId) => {
  try {
    const response = await apiConnector(
      "DELETE",
      `${CANCEL_SEND_FRIEND_REQUEST}`,
      { userId },
      {},
      {}
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error("getChatDetails API ERROR:", error);
    toast.error(
      `Cancle Request error: ${error.message || "An unexpected error occurred"}`
    );
  }
};

export const getNotifications = async () => {
  try {
    const response = await apiConnector(
      "GET",
      `${GET_NOTIFICATIONS}`,
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

export const acceptFriendRequest = async (requestId, accept) => {
  try {
    const response = await apiConnector(
      "POST",
      `${ACCEPT_FRIEND_REQUEST}`,
      { requestId, accept },
      {},
      {}
    );
    return response;
  } catch (error) {
    console.error("API ERROR WHILE FRIEND REQUEST ACCEPT OR REJECT:", error);
    toast.error(
      `Friend Req error: ${error.message || "An unexpected error occurred"}`
    );
  }
};

export const getMyFriends = async (chatId = null) => {
  try {
    const response = await apiConnector(
      "GET",
      `${GET_MY_FRIENDS}`,
      {},
      { chatId },
      {}
    );
    return response;
  } catch (error) {
    console.error("API ERROR WHILE FRIEND REQUEST ACCEPT OR REJECT:", error);
    toast.error(
      `Friend Req error: ${error.message || "An unexpected error occurred"}`
    );
  }
};
