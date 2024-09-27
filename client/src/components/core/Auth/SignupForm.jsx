import { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import profilePhoto from "../../../assets/images/profilePic.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../../services/operations/auth.js";

function SignupForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    bio: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profilePic, setProfilePic] = useState(profilePhoto);
  const [profilePicFile, setProfilePicFile] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { fullName, userName, bio, email, password, confirmPassword } =
    formData;

  const handleOnChange = (e) => {
    if (e.target.name === "profilePicture" && e.target.files) {
      const file = e.target.files[0];
      const fileUrl = URL.createObjectURL(file);
      setProfilePic(fileUrl);
      setProfilePicFile(file);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (!profilePicFile) {
      toast.error("Please upload profile photo");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("invalid email id");
      return;
    }

    if (password.length < 5) {
      toast.error("Passwords is too small");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords and Confirm Password Do Not Match");
      return;
    }

    const formData = new FormData();

    formData.append("name", fullName);
    formData.append("username", userName);
    formData.append("bio", bio);
    formData.append("email", email);
    formData.append("password", password);

    if (profilePicFile) {
      formData.append("avatar", profilePicFile);
    }

    dispatch(signUp(formData, navigate));

    setFormData({
      fullName: "",
      userName: "",
      bio: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    setProfilePic(profilePhoto);
    setProfilePicFile(null);
  };

  return (
    <div>
      <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
        <label className="w-full flex flex-col items-center">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Profile Picture
          </p>
          <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-300">
            <img
              src={profilePic}
              alt="Profile Preview"
              className="object-cover w-full h-full"
            />
            <input
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={handleOnChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </label>
        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Full Name <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type="text"
            name="fullName"
            value={fullName}
            onChange={handleOnChange}
            placeholder="Enter full name"
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          />
        </label>

        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            UserName <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type="text"
            name="userName"
            value={userName}
            onChange={handleOnChange}
            placeholder="Enter username"
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          />
        </label>

        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Bio
          </p>
          <textarea
            name="bio"
            value={bio}
            onChange={handleOnChange}
            placeholder="Tell us about yourself"
            rows="4"
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 h-[3rem]"
          />
        </label>

        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Email Address <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type="text"
            name="email"
            value={email}
            onChange={handleOnChange}
            placeholder="Enter email address"
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          />
        </label>

        <div className="flex gap-x-4">
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Create Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Enter Password"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>

          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Confirm Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              placeholder="Confirm Password"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
