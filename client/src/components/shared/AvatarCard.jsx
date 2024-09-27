import React from "react";
import { transformImage } from "../../lib/features";

const AvatarCard = ({ avatar = [], max = 4 }) => {
  return (
    <div className="flex relative">
      <div className="relative w-12 h-12">
        {avatar.slice(0, max).map((i, index) => (
          <img
            key={Math.random() * 100}
            src={transformImage(i)}
            alt={`Avatar ${index}`}
            className="absolute w-12 h-12 rounded-full object-cover"
            style={{
              left: `${index * 12}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AvatarCard;
