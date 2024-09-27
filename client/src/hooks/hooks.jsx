import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { debounce } from "lodash";

export const useErrors = (errors = []) => {
  useEffect(() => {
    errors
      .filter(({ isError }) => isError)
      .forEach(({ error, fallback }) => {
        if (fallback) fallback();
        else toast.error(error?.data?.message || "Something went wrong");
      });
  }, [errors]);
};

export const useAsyncMutation = (mutationHook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const [mutate] = mutationHook();

  const executeMutation = async (
    toastMessage = "Updating data...",
    ...args
  ) => {
    setIsLoading(true);
    const toastId = toast.loading(toastMessage);

    try {
      const res = await mutate(...args);

      if (res.data) {
        toast.success(res.data.message || "Updated data successfully", {
          id: toastId,
        });
        setData(res.data);
      } else {
        toast.error(res?.error?.data?.message || "Something went wrong", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return [executeMutation, isLoading, data];
};

export const useSocketEvents = (socket, handlers) => {
  useEffect(() => {
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket, handlers]);
};

export const useInfiniteScrollTop = (
  containerRef,
  totalPages,
  currentPage,
  setPage,
  initialMessages
) => {
  const [data, setData] = useState(initialMessages ? [...initialMessages] : []);
  const [isFetching, setIsFetching] = useState(false);

  const prependMessages = useCallback((newMessages) => {
    setData((prevMessages) => {
      const uniqueMessages = new Map();

      prevMessages.forEach((msg) => uniqueMessages.set(msg._id, msg));

      newMessages.forEach((msg) => uniqueMessages.set(msg._id, msg));

      return [...uniqueMessages.values()].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    });
  }, []);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || currentPage >= totalPages || isFetching)
      return;

    const { scrollTop } = containerRef.current;

    if (scrollTop === 0) {
      setIsFetching(true);
      setPage(currentPage + 1);
    }
  }, [containerRef, currentPage, totalPages, setPage, isFetching]);

  useEffect(() => {
    const ref = containerRef.current;

    if (ref) {
      ref.addEventListener("scroll", handleScroll);

      return () => {
        ref.removeEventListener("scroll", handleScroll);
      };
    }
  }, [containerRef, handleScroll]);

  useEffect(() => {
    if (initialMessages && initialMessages.length) {
      prependMessages(initialMessages);
    }
    setIsFetching(false);
  }, [initialMessages, prependMessages]);

  return { data, setData };
};
