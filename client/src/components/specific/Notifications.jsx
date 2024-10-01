import React, { memo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsNotification } from "../../redux/slices/misc";
import {
  getNotifications,
  acceptFriendRequest,
} from "../../services/operations/friend";
import toast from "react-hot-toast";

const useFetchNotifications = () => {
  const [data, setData] = useState({ chatDetails: [], messages: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getNotifications();
        setData(response);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, isLoading, isError };
};

const Notifications = () => {
  const dispatch = useDispatch();
  const { isNotification } = useSelector((state) => state.misc);
  const { isLoading, data, error, isError } = useFetchNotifications();

  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
    await acceptFriendRequest(_id, accept);
    if (accept) {
      toast.success("Friend Request accepted");
    } else {
      toast.success("Friend Request Rejected");
    }
  };

  const closeHandler = () => dispatch(setIsNotification(false));

  if (!isNotification) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={closeHandler}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out" />

      <div
        className="relative bg-white w-full max-w-lg rounded-lg shadow-2xl overflow-hidden transition-transform transform-gpu scale-95 "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b p-4 bg-gray-100 text-xl font-bold text-gray-700">
          Notifications
        </div>

        <div className="p-5 space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-6 bg-gray-200 rounded-md animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <>
              {data?.allRequests.length > 0 ? (
                data?.allRequests.map(({ sender, _id }) => (
                  <NotificationItem
                    sender={sender}
                    _id={_id}
                    handler={friendRequestHandler}
                    key={_id}
                  />
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No new notifications
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <div className="flex items-center space-x-4 p-3 border-b border-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out">
      <img
        src={avatar || "/default-avatar.png"}
        alt={name}
        className="w-12 h-12 rounded-full shadow-sm"
      />
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">{name}</p>
        <p className="text-xs text-gray-500">sent you a friend request</p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => handler({ _id, accept: true })}
          className="px-4 py-2 bg-green-500 text-black text-sm font-medium rounded-lg shadow-md hover:bg-green-600 focus:ring-2 focus:ring-green-400"
        >
          Accept
        </button>
        <button
          onClick={() => handler({ _id, accept: false })}
          className="px-4 py-2 bg-red-500 text-black text-sm font-medium rounded-lg shadow-md hover:bg-red-600 focus:ring-2 focus:ring-red-400"
        >
          Reject
        </button>
      </div>
    </div>
  );
});

export default Notifications;
