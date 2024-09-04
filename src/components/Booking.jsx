import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./booking.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Booking = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          "https://chat-application-26f5.vercel.app/api/booking/getAll"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const result = await response.json();
        setMessages(result.data);
      } catch (error) {
        toast.error("Error fetching messages");
      }
    };

    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    if (message.trim() === "") {
      toast.error("Message cannot be empty!");
      return;
    }

    try {
      const response = await fetch(
        "https://chat-application-26f5.vercel.app/api/booking/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: message }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add the message");
      }

      const result = await response.json();
      setMessages((prevMessages) => [...prevMessages, result.data]);
      setMessage("");
      toast.success("Message added successfully!");
    } catch (error) {
      toast.error("Error adding message");
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      const response = await fetch(
        `https://chat-application-26f5.vercel.app/api/booking/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the message");
      }

      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== id)
      );
      toast.success("Message deleted successfully!");
    } catch (error) {
      toast.error("Error deleting message");
    }
  };
  return (
    <div>
      <ToastContainer />
      <img
        id="backgroundimg"
        src="https://cdn.pixabay.com/photo/2016/11/29/04/42/conifers-1867371_960_720.jpg"
        alt="Background"
      />
      <div className="main">
        <div className="header">
          <div className="center">
            <div>
              <img
                className="pfp"
                src="https://cdn.pixabay.com/photo/2014/11/30/14/11/cat-551554_960_720.jpg"
                alt="Profile"
              />
              <p id="pfpname">Sruti Sucharita Samal</p>
            </div>
          </div>
        </div>

        <div className="content">
          <div style={{ padding: "11px" }}>
            {messages.map((msg) => (
              <div key={msg._id} className="msg-btn-holder">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className="receiver-msg msg-btn"
                >
                  <p>{msg.name}</p>
                  <div style={{ padding: "10px" }} className="message-action">
                    <i
                      className="fas fa-trash-alt delete-icon"
                      style={{ cursor: "pointer", color: "#ff4d4d" }}
                      onClick={() => handleDeleteMessage(msg._id)}
                    ></i>
                  </div>
                </div>
                <br />
              </div>
            ))}
          </div>
        </div>

        <div className="footer">
          <div style={{ width: "100%", padding: "11px" }}>
            <input
              placeholder="Message"
              className="text-box"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="send-ico" onClick={handleSendMessage}>
              <i
                style={{ position: "absolute" }}
                className="fas fa-paper-plane"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
