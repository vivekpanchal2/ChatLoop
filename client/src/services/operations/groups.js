import toast from "react-hot-toast";
import { chatEndPoints } from "../apis";
import { apiConnector } from "../apiconnector";
import { setLoading } from "../../redux/slices/chat";
const {
  GET_MY_GROUPS,
  REMOVE_GROUP_MEMBER,
  ADD_GROUP_MEMBER,
  RENAME_GROUP,
  NEW_GROUP_CHAT,
} = chatEndPoints;

export function newGroupChat({ name, members }) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "POST",
        NEW_GROUP_CHAT,
        { name, members },
        {},
        {}
      );

      console.log("api response", response);

      return response;
    } catch (error) {
      console.error("createGroup API ERROR:", error);
      toast.error(
        `Group crating error: ${
          error.message || "An unexpected error occurred"
        }`
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function getMyGroups() {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("GET", GET_MY_GROUPS, {}, {}, {});

      console.log("api response", response);

      return response;
    } catch (error) {
      console.error("getMyGroups API ERROR:", error);
      toast.error(
        `Group Fetching error: ${
          error.message || "An unexpected error occurred"
        }`
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function removeGroupMember({ chatId, userId }) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "POST",
        REMOVE_GROUP_MEMBER,
        { chatId, userId },
        {},
        {}
      );

      toast.success(response.message);
      return response;
    } catch (error) {
      console.error("Remove API ERROR:", error.response.data.message);
      toast.error(
        ` ${error.response.data.message || "An unexpected error occurred"}`
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function addGroupMember({ members, chatId }) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "POST",
        ADD_GROUP_MEMBER,
        { members, chatId },
        {},
        {}
      );

      console.log("api response", response);

      return response;
    } catch (error) {
      console.error("Remove API ERROR:", error);
      toast.error(
        `Member remove error: ${
          error.message || "An unexpected error occurred"
        }`
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function renameGroup({ chatId, name }) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "POST",
        `${RENAME_GROUP}/${chatId}`,
        { name },
        {},
        {}
      );

      console.log("api response", response);

      return response;
    } catch (error) {
      console.error("Remove API ERROR:", error);
      toast.error(
        `Member remove error: ${
          error.message || "An unexpected error occurred"
        }`
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function leaveGroup({ chatId, name }) {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "POST",
        `${RENAME_GROUP}/${chatId}`,
        { name },
        {},
        {}
      );

      console.log("api response", response);

      return response;
    } catch (error) {
      console.error("Remove API ERROR:", error);
      toast.error(
        `Member remove error: ${
          error.message || "An unexpected error occurred"
        }`
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
}
