import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef(null);

  const userId = user?._id;
  const firstName = user?.firstName;
  const lastName = user?.lastName;

  const fetchChatMessages = async () => {
    try {
      const response = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });
      const formattedMessages = response?.data?.chat?.messages.map(
        (message) => ({
          firstName: message.senderId.firstName,
          lastName: message.senderId.lastName,
          text: message.text,
          timestamp: message.createdAt,
        })
      );
      setMessages(formattedMessages);
      console.log(formattedMessages);
    } catch (error) {
      setMessages([]);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    socket.emit("joinChat", { userId, targetUserId });

    socket.on("messageReceived", ({ firstName, text }) => {
      setMessages((state) => [...state, { firstName, text }]);
    });

    return () => {
      //   socket.emit("disconnect");
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    const socket = createSocketConnection();
    if (newMessage) {
      socket.emit("sendMessage", {
        firstName,
        lastName,
        userId,
        targetUserId,
        text: newMessage,
      });
      setNewMessage("");
    }
    scrollToBottom();
  };

  const scrollToBottom = () => {
    const el = bottomRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="my-10 mx-auto w-3/4 border border-gray-600 h-[70vh] flex flex-col bg-base-300">
      <h1 className="font-bold text-2xl py-3 text-center border-b border-gray-600">
        Chat
      </h1>
      <div className="flex-1 overflow-y-auto p-3" ref={bottomRef}>
        {messages &&
          messages.map((msg, index) => {
            const time = new Date(msg?.timestamp || Date.now());
            return (
              <div
                key={index}
                className={`chat ${
                  msg.firstName === user?.firstName ? "chat-end" : "chat-start"
                }`}
              >
                <div className="chat-header">
                  {msg.firstName} {msg.lastName}
                  <time className="text-xs opacity-50 ml-2">
                    {time.getHours()}:{time.getMinutes()}
                  </time>
                </div>
                <div className="chat-bubble">{msg.text}</div>
              </div>
            );
          })}
      </div>
      <div className="flex gap-5 p-5 border-t border-gray-600">
        <input
          type="text"
          className="w-4/5 px-3"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleEnter}
        />
        <button className="btn btn-primary w-1/5" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
