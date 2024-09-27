import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu, setUploadingLoader } from "../../redux/slices/misc";
import {
  AiOutlineFileImage,
  AiOutlineAudio,
  AiOutlineVideoCamera,
  AiOutlineFile,
} from "react-icons/ai";
import toast from "react-hot-toast";
import { sendAttachments } from "../../services/operations/chat";

const FileMenu = ({ chatId }) => {
  const { isFileMenu } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  console.log({ chatId });

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);
  const menuRef = useRef(null);

  const closeFileMenu = () => dispatch(setIsFileMenu(false));

  const selectImage = () => imageRef.current?.click();
  const selectAudio = () => audioRef.current?.click();
  const selectVideo = () => videoRef.current?.click();
  const selectFile = () => fileRef.current?.click();

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);

    if (files.length <= 0) return;

    if (files.length > 5)
      return toast.error(`You can only send 5 ${key} at a time`);

    dispatch(setUploadingLoader(true));

    const toastId = toast.loading(`Sending ${key}...`);
    closeFileMenu();

    try {
      const myForm = new FormData();

      myForm.append("chatId", chatId);
      files.forEach((file) => myForm.append("files", file));

      const res = await sendAttachments(myForm);

      console.log(res);

      if (res) toast.success(`${key} sent successfully`, { id: toastId });
      else toast.error(`Failed to send ${key}`, { id: toastId });
    } catch (error) {
      toast.error(error.message || "An error occurred", { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeFileMenu();
      }
    };
    if (isFileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFileMenu]);

  return (
    <div
      ref={menuRef}
      className={` w-full h-full bg-white shadow-lg rounded-lg border border-gray-200 transition-transform duration-300 transform ${
        isFileMenu
          ? "scale-100 opacity-100"
          : "scale-95 opacity-0 pointer-events-none"
      }`}
      style={{ zIndex: 999 }}
    >
      <div className="flex flex-col p-2">
        <div
          className="flex items-center p-3 hover:bg-gray-50 transition-colors cursor-pointer rounded-t-lg hover:bg-black hover:text-white "
          onClick={selectImage}
        >
          <AiOutlineFileImage className=" mr-3 text-xl" />
          <span className="text-gray-800">Image</span>
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg, image/gif"
            className="hidden"
            onChange={(e) => fileChangeHandler(e, "Images")}
            ref={imageRef}
          />
        </div>

        <div
          className="flex items-center p-3 hover:bg-gray-50 transition-colors cursor-pointer hover:bg-black hover:text-white"
          onClick={selectAudio}
        >
          <AiOutlineAudio className=" mr-3 text-xl" />
          <span className="text-gray-800">Audio</span>
          <input
            type="file"
            multiple
            accept="audio/mpeg, audio/wav"
            className="hidden"
            onChange={(e) => fileChangeHandler(e, "Audios")}
            ref={audioRef}
          />
        </div>

        <div
          className="flex items-center p-3 hover:bg-gray-50 transition-colors cursor-pointer hover:bg-black hover:text-white"
          onClick={selectVideo}
        >
          <AiOutlineVideoCamera className=" mr-3 text-xl" />
          <span className="text-gray-800">Video</span>
          <input
            type="file"
            multiple
            accept="video/mp4, video/webm, video/ogg"
            className="hidden"
            onChange={(e) => fileChangeHandler(e, "Videos")}
            ref={videoRef}
          />
        </div>

        <div
          className="flex items-center p-3 hover:bg-gray-50 transition-colors cursor-pointer rounded-b-lg hover:bg-black hover:text-white"
          onClick={selectFile}
        >
          <AiOutlineFile className=" mr-3 text-xl" />
          <span className="text-gray-800">File</span>
          <input
            type="file"
            multiple
            accept="*"
            className="hidden"
            onChange={(e) => fileChangeHandler(e, "Files")}
            ref={fileRef}
          />
        </div>
      </div>
    </div>
  );
};

export default FileMenu;
