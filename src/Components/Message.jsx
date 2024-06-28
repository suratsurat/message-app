import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ref, get, set, query, onValue, update } from "firebase/database";
import { db } from "../firebase";
import { format, getUnixTime } from "date-fns";
// import Timeago from "react-timeago";
import { FaCircle } from "react-icons/fa";
import TimeAgo from "javascript-time-ago";

const Message = () => {
  const [message, setMessage] = useState([]);
  const sender = localStorage.getItem("email").split("@")[0];
  const lastMessageRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [user, setUser] = useState("");
  const circleColor = user.status === "online" ? "text-green-500" : "text-red-500";

  // message/:email mathi email parameter leva mate..
  const { email } = useParams();
  
  const usersRef = ref(db, "users/" + email); // firebase na realtimedatabse ma users/email ma fetch krse"

  useEffect(() => {
    get(usersRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          setUser(snapshot.val());

          // Real-time status listener (status jevu realtimedatabase ma update thse tevu j ahi update thse.)
          const userStatusRef = ref(db, "users/" + email + "/status");
          onValue(userStatusRef, (snapshot) => {
            const status = snapshot.val();
            setUser((prevUser) => ({
              ...prevUser,
              status: status || "offline", // Default to offline if status not available
            }));
          });
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  
  const setMessageData = (e) => {
    e.preventDefault();

    //jo input empty hse and user send krse to message send nhi thay and pachu inputvalue blank thay jse..
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) {
      setInputValue("");
      return;
    }

    // message realtimedatabse ma store krva...
    set(ref(db, "message/" + getUnixTime(new Date())), {
      sender: localStorage.getItem("email").split("@")[0],
      receiver: email,
      time: Date.now(),
      message: inputValue,
    })
      .then(() => {
        setInputValue("");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchMessageData();
  }, [setMessageData]);

  //message ne fetch krva...
  const fetchMessageData = () => {
    const messagesRef = ref(db, "message");
    const messageQuery = query(messagesRef);
    const sender = localStorage.getItem("email");

    get(messageQuery)
      .then((snapshot) => {
        const fetchedMessages = [];
        snapshot.forEach((childSnapshot) => {
          const message = childSnapshot.val();
          if (
            // jo sender=user(email=params) hoy OR receiver(email=params) hoy to message fetch thse.  
            (message.sender === sender?.split("@")[0] &&
              message.receiver === email) ||
            (message.sender === email &&
              message.receiver === sender?.split("@")[0])
          ) {
            fetchedMessages.push({
              ...message,
            });
          }
          // console.log(fetchedMessages)
        });
        // je message fetch thya che tene set krva...
        setMessage(fetchedMessages);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }; // console.log(message)

  useEffect(() => {
    // jevo user avse tevu scroll thay ne last message sudhi jse and 1 sec pchi stop thay jse.
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
      const timer = setTimeout(() => {
        // Clear the timeout and stop auto-scrolling
        clearTimeout(timer);
        lastMessageRef.current = null;
      }, 1000);
    }
  }, [message]);

    //  jo tab or window open close thse to status: online thse.
    // <----Not Important---->
                  useEffect(() => {
                    const loggedInUserEmail = localStorage.getItem("email");
                    const updateStatus = () => {
                      update(ref(db, `users/${loggedInUserEmail.split("@")[0]}`), {
                        status: "online",
                      });
                    };
                    const handleWindowClose = () => {
                      updateStatus();
                    };
                    const handleTabChange = () => {
                      if (document.visibilityState === "hidden") {
                        updateStatus();
                      }
                    };
                    window.addEventListener("beforeunload", handleWindowClose);
                    document.addEventListener("visibilitychange", handleTabChange);
                    return () => {
                      window.removeEventListener("beforeunload", handleWindowClose);
                      document.removeEventListener("visibilitychange", handleTabChange);
                    };
                  }, []);

  // message niche nu date and time format
  const formatDateTime = (timestamp) => {
    const dateObj = new Date(timestamp);
    return format(dateObj, "dd-MM-yyyy hh:mm:ss a");
  };

  // // 1 seconds ago nu  format
  // const formatAgo = (value, unit) => {
  //   if (value !== 1) {
  //     unit += "s"; // pluralize units (seconds, minutes, hours, etc.)
  //   }
  //   return `${value} ${unit} ago`;
  // };

  return (
    <div className="h-[calc(100vh_-_67px)] flex flex-col relative">
      {/* Header */}
      <div className="absolute w-full top-0 z-10 flex text-center bg-gray-800 text-white py-4 px-6">
        <div className="h-12 w-12 inline-flex items-center justify-center overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
          <span className="relative w-4 font-large text-xl text-center text-gray-600 dark:text-gray-300">
            {user?.fname?.[0]}
          </span>
        </div>
        <div className="inline-flex items-center">
          <h2 className="ml-2 text-lg font-semibold">
            {user?.fname} {user?.lname}
          </h2>
          <div className={`text-sm absolute top-8 right-6`}>
          <FaCircle size={10} className={`inline-block mr-1 ${circleColor}`} />
          {user.status === "online" ? (
              "Online"
            ) : (
                "Offline"
            )
            //  : (  <TimeAgo date={Date().now}/> )  => "1 sec ago"
          }
          </div>
        </div>
      </div>

      {/* Message Display Area */}
      <div className="h-full mb-[80px] mt-[80px] p-2 bg-gray-100 overflow-y-auto">
        {message.map((msg, index) => (
          <div
            key={index}
            ref={index === message.length - 1 ? lastMessageRef : null}
            className={`flex ${
              msg.sender === localStorage.getItem("email").split("@")[0]
                ? "justify-end" // sender no message right side avse
                : "justify-start" // receiver no message left side avse
            } m-2`}
          >
            <div
              className={`bg-blue-500 text-white py-2 px-4 rounded-full max-w-[50%] ${
                msg.sender === sender ? "bg-green-500" : "bg-blue-500"
              }`}
            >
              {msg.message}
              <div className="text-[10px] text-gray-300">
                {formatDateTime(msg.time)}
              </div>
            </div>
          </div>
        ))}
        
        {/* This div ensures the last message is always in view */}
        <div ref={lastMessageRef}></div>
      </div>

      {/* Message Input */}
      <form
        onSubmit={(e) => setMessageData(e)}
        className="absolute w-full  bottom-0 bg-white p-4"
      >
        <div className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 rounded-lg py-2 px-4 mr-2 focus:outline-none"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="px-4 bg-blue-500 text-white rounded-lg focus:outline-none hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Message;
