import { useCallback, useEffect, useRef, useState } from "react";

const loadSocketClient = (baseUrl) =>
  new Promise((resolve, reject) => {
    if (window.io) return resolve(window.io);

    const script = document.createElement("script");
    script.src = `${baseUrl}/socket.io/socket.io.js`;
    script.async = true;

    script.onload = () => resolve(window.io);
    script.onerror = () => reject(new Error("Socket load failed"));

    document.head.appendChild(script);
  });

const useSocket = (token, user) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [bookingAccepted, setBookingAccepted] = useState(null);
  const [serviceCompleted, setServiceCompleted] = useState(null);

  useEffect(() => {
    if (!token || !user?.id) return;

    const baseUrl = getSocketBaseUrl();
    let socket;

    loadSocketClient(baseUrl)
      .then((io) => {
        socket = io(baseUrl, {
          auth: { token },
          transports: ["websocket"],
        });

        socketRef.current = socket;
        socket.on("connect", () => setConnected(true));
        socket.on("disconnect", () => setConnected(false));
        socket.on("booking_accepted", (data) => {
          setBookingAccepted(data);
        });
        socket.on("service_completed", (data) => {
          setServiceCompleted(data);
        });
      })
      .catch(() => setConnected(false));

    return () => {
      if (socket) {
        socket.off("booking_accepted");
        socket.off("service_completed");
        socket.disconnect();
      }
      socketRef.current = null;
      setConnected(false);
    };
  }, [token, user?.id]);

  const joinBookingRoom = useCallback((bookingId) => {
    socketRef.current?.emit("join_booking", bookingId);
  }, []);

  const leaveBookingRoom = useCallback((bookingId) => {
    socketRef.current?.emit("leave_booking", bookingId);
  }, []);

  return {
    connected,
    bookingAccepted,
    serviceCompleted,
    joinBookingRoom,
    leaveBookingRoom,
  };
};

export default useSocket;
