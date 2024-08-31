const IconBtn = ({ title, icon, onClick, value }) => {
  return (
    <div className="relative group">
      <button
        className="text-white hover:text-gray-300"
        aria-label={title}
        onClick={onClick}
      >
        {value ? (
          <div className="relative">
            <div className="absolute bottom-2 left-2 h-4 bg-pink-500 rounded-full flex items-center">
              <span className="text-[0.5rem] text-center text-white p-1">
                {value}
              </span>
            </div>
            {icon}
          </div>
        ) : (
          icon
        )}
      </button>

      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block text-xs text-white bg-black rounded px-2 py-1">
        {title}
      </span>
    </div>
  );
};

export default IconBtn;
