import React, { useState } from "react";
import LoginForm from "../components/core/Auth/LoginForm.jsx";
import SignupForm from "../components/core/Auth/SignupForm.jsx";
import img from "../assets/images/img.png";

function Login() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin((prev) => !prev);

  return (
    <div className="flex flex-col relative w-full items-center justify-center bg-gray-100 text-white h-screen gap-4">
      <div className="text-black text-xl md:text-2xl lg:text-2xl">
        Welcome to ChatX
      </div>
      <div
        className={`flex flex-col-reverse md:flex-row w-11/12 max-w-3xl bg-richblack-700 shadow-lg rounded-lg  md:p-12 gap-x-10`}
      >
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start p-6">
          <h1 className="text-2xl flex md:hidden font-semibold text-gray-800 my-4 w-full justify-center  border-b-2 border-richblack-500 text-center p-3 ">
            {isLogin ? "Sign In to Continue" : "Welcome to ChatLoop"}
          </h1>

          {isLogin ? <LoginForm /> : <SignupForm />}

          <div className="flex justify-center mt-6 w-full">
            <button
              onClick={toggleForm}
              className="text-white underline hover:text-yellow-25"
            >
              {isLogin
                ? "New User? Create an Account"
                : "Already have an account? Log In"}
            </button>
          </div>
        </div>

        <div className="w-1/2 hidden md:flex md:flex-col  items-center justify-center ">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            {isLogin ? "Sign In to Continue" : "Welcome to ChatLoop"}
          </h1>
          <img src={img} alt="Illustration" className="w-full h-auto" />
          <p className="text-lg text-white mt-10">
            {isLogin ? (
              <>
                <span>Stay in the Loop </span>
                <span className="font-bold text-yellow-25">
                  Anytime, Anywhere.
                </span>
              </>
            ) : (
              <>
                <span>
                  <span className="font-bold text-yellow-50">
                    Chat, Connect
                  </span>{" "}
                  and <span className="font-bold text-yellow-50">Loop</span> In
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
