import React from "react";
import { transformImage } from "../../lib/features";
import { AiOutlineFile } from "react-icons/ai";

const RenderAttachment = (file, url) => {
  switch (file) {
    case "video":
      return (
        <video src={url} preload="none" className="w-[200px] h-auto" controls />
      );

    case "image":
      return (
        <img
          src={transformImage(url, 200)}
          alt="Attachment"
          className="w-[200px] h-[150px] object-contain"
        />
      );

    case "audio":
      return <audio src={url} preload="none" className="w-full" controls />;

    default:
      return <AiOutlineFile className="text-3xl" />;
  }
};

export default RenderAttachment;
