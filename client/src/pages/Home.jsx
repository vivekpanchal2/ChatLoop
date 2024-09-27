import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../redux/slices/misc";

function Home() {
  const dispatch = useDispatch();

  return (
    <>
      <div className="flex flex-col justify-center items-center h-[calc(100%-20px)] gap-20 overflow-hidden">
        <div className="p-5 flex flex-col gap-3">
          <div className="text-4xl">Welcome to ChatX</div>
          <div className="text-lg text-center">
            Select a friend to start chatting,
          </div>
        </div>
        <div className="p-5 flex flex-col gap-3 w-1/2 ">
          <div className="text-center ">No Friends? Don't Worry</div>
          <div
            className="border-2 p-3 flex flex-row gap-2 justify-center items-center rounded-3xl cursor-pointer"
            onClick={() => dispatch(setIsSearch(true))}
          >
            <FaSearch />
            Find Friends
          </div>
        </div>
      </div>
      <div>Crafted With ❤️ By Vivek Panchal</div>
    </>
  );
}

export default AppLayout(Home);
