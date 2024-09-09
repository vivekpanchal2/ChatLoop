import { toast } from "react-hot-toast";
import { setLoading, setToken, setUser } from "../../redux/slices/auth";
import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";

const { SIGNUP_API, LOGIN_API } = endpoints;

export function signUp(formData, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");

    dispatch(setLoading(true));

    try {
      // Debugging: log formData for verification
      console.log("FormData being sent:", formData);

      const response = await apiConnector(
        "POST",
        SIGNUP_API,
        formData,
        {},
        { "Content-Type": "multipart/form-data" }
      );

      console.log("SIGNUP API RESPONSE:", response);

      console.log(response.success);

      if (!response.success) {
        throw new Error(response.message || "Signup failed");
      }

      dispatch(setToken(response.token));
      dispatch(setUser(response.user));

      localStorage.setItem("token", JSON.stringify(response.token));
      localStorage.setItem("user", JSON.stringify(response.user));

      toast.success("Signup Successful");
      navigate("/");
    } catch (error) {
      console.error("SIGNUP API ERROR:", error);
      toast.error(
        `Signup Failed: ${error.message || "An unexpected error occurred"}`
      );
      navigate("/login");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    const validator = email;
    try {
      const response = await apiConnector(
        "POST",
        LOGIN_API,
        {
          validator,
          password,
        },
        {},
        {}
      );

      console.log("LOGIN API RESPONSE............", response);

      if (!response.success) {
        throw new Error(response.message);
      }

      toast.success("Login Successful");

      dispatch(setToken(response.token));

      dispatch(setUser(response.user));

      localStorage.setItem("token", JSON.stringify(response.token));

      localStorage.setItem("user", JSON.stringify(response.user));

      navigate("/");
    } catch (error) {
      console.log("LOGIN API ERROR............", error);

      toast.error("Login Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/");
  };
}
