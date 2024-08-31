import React from "react";

function Loader() {
  return (
    <div className="flex flex-row animate-pulse">
      <div className="hidden min-[500px]:block w-3/6 h-[calc(100vh-4rem)] bg-white border-r-2 border-richblack-50">
        <div className="flex flex-col ">
          {Array.from({ length: 8 }).map((_, i) => {
            return <div className="h-16 bg-richblack-50 m-1"></div>;
          })}
        </div>
      </div>

      <div className="w-full h-[calc(100vh-4rem)] bg-richblack-50 mx-4 my-2"></div>
      <div className="hidden lg:block w-2/6 h-[calc(100vh-4rem)] bg-richblack-25 m-2 p-4"></div>
    </div>
  );
}

export default Loader;
