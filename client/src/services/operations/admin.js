import { toast } from "react-hot-toast";
import {
  setLoading,
  setToken,
  setIsAdmin,
  setUser,
} from "../../redux/slices/auth";
import { apiConnector } from "../apiconnector";
import { adminEndPoints } from "../apis";

const {
  ADMIN_LOGIN,
  GET_DASHBOARD_STATE,
  GET_ADMIN,
  ADMIN_LOGOUT,
  ADMIN_ALL_CHATS,
  ADMIN_ALL_MESSAGES,
  ADMIN_ALL_USER,
} = adminEndPoints;

export function adminLogin(secretKey, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");

    dispatch(setLoading(true));

    try {
      const response = await apiConnector(
        "POST",
        ADMIN_LOGIN,
        { secretKey },
        {},
        {}
      );

      console.log("Admin Login Response:", response);

      console.log(response.success);

      if (!response.success) {
        throw new Error(response.message || "Signup failed");
      }

      dispatch(setIsAdmin(true));

      localStorage.setItem("forbiddenZone", true);

      localStorage.removeItem("user");
      toast.success("Login Successful");
    } catch (error) {
      console.error("ADMIN LOGIN API ERROR:", error);
      toast.error(
        `LOGIN Failed: ${error.message || "An unexpected error occurred"}`
      );
      console.log("Catch Triggeressssssssssss");
      navigate("/admin");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function getDashboardStats() {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "GET",
        GET_DASHBOARD_STATE,
        {},
        {},
        {}
      );

      if (!response.success) {
        throw new Error(response.message || "Signup failed");
      }
      return response;
    } catch (error) {
      console.error("DASHBOARD API ERROR:", error);
      toast.error(`${error.message || "An unexpected error occurred"}`);
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function getAdmin() {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_ADMIN, {}, {}, {});

      if (!response.success) {
        throw new Error(response.message || "Admin Info failed");
      }
    } catch (error) {
      console.error("Admin Info API ERROR:", error);
      toast.error(`${error.message || "An unexpected error occurred"}`);
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function adminLogout() {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");

    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", ADMIN_LOGOUT, {}, {}, {});

      console.log("Admin Logout Response:", response);

      console.log(response.success);

      if (!response.success) {
        throw new Error(response.message || "Signup failed");
      }

      dispatch(setIsAdmin(false));

      localStorage.removeItem("forbiddenZone");

      toast.success("Logout Successful");
    } catch (error) {
      console.error("ADMIN LOGIN API ERROR:", error);
      toast.error(
        `LOGOUT Failed: ${error.message || "An unexpected error occurred"}`
      );
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function getAllChats() {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", ADMIN_ALL_CHATS, {}, {}, {});

      console.log(response);

      if (!response.success) {
        throw new Error(response.message || "ADMIN Chat fetching failed");
      }

      return response;
    } catch (error) {
      console.error("ADMIN ALL CHAT API ERROR:", error);
      toast.error(`${error.message || "An unexpected error occurred"}`);
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function getAllMessages() {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "GET",
        ADMIN_ALL_MESSAGES,
        {},
        {},
        {}
      );

      console.log(response);

      if (!response.success) {
        throw new Error(response.message || "ADMIN Message fetching failed");
      }

      return response;
    } catch (error) {
      console.error("ADMIN ALL MESSAGE API ERROR:", error);
      toast.error(`${error.message || "An unexpected error occurred"}`);
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function getAllUsers() {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", ADMIN_ALL_USER, {}, {}, {});

      console.log(response);

      if (!response.success) {
        throw new Error(response.message || "ADMIN USER fetching failed");
      }

      return response;
    } catch (error) {
      console.error("ADMIN ALL USER API ERROR:", error);
      toast.error(`${error.message || "An unexpected error occurred"}`);
    } finally {
      dispatch(setLoading(false));
    }
  };
}
