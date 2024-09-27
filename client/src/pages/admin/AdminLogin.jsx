import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { adminLogin, getAdmin } from "../../services/operations/admin";

const AdminLogin = () => {
  const { isAdmin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [secretKey, setSecretKey] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("secret key in the handler: ", secretKey);
    await dispatch(adminLogin(secretKey, navigate));
  };

  if (isAdmin) return <Navigate to="/admin/dashboard" />;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-xs bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>

        <form className="mt-6 w-full" onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-gray-700">Secret Key</label>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Login
          </button>
        </form>

        <div>
          <a href="/">click</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
