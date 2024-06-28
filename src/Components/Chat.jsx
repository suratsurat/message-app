import React, { useEffect, useState } from "react";
import { get, ref, update } from "firebase/database";
import { db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  
  // fetchUsers() 1 var j call kravva..
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    const usersRef = ref(db, "users");
    get(usersRef)
      .then((response) => {
        if (response.exists()) {
          //jo response exist hse to..
          const usersData = response.val();
          //badha user ne fetch krva Array thi loop chalse..
          const usersArray = Object.keys(usersData).map((userId) => ({
            id: userId,
            ...usersData[userId],
          }));

          //localstorage mathi "email" key na data leva..
          const loggedInUserEmail = localStorage.getItem("email");

          // jo user sigin thay to realtimedatabase update thse..
          update(ref(db, "users/" + loggedInUserEmail.split("@")[0]), {
            status: "online",
          });

          // Filter out the logged-in user from usersArray etle k je signin user che teni shivayna badha user btavse.
          const filteredUsers = usersArray.filter(
            (user) => user.email !== loggedInUserEmail
          );
          //jo user n hoy to set n thay mate filteredUsers.length > 0.
          if (filteredUsers.length > 0) {
            setUsers(filteredUsers);
          } else {
            alert("There are No Users to communicate with you.");
          }
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  //SignOut mate..
  const signoutUser = (e) => {
    e.preventDefault();
    const userEmail = localStorage.getItem("email");// email localstorage mathi get krva
    const cleanedEmail = userEmail.replace(/\./g, "");// email mathi . kadhi nakhva
    const emailParts = cleanedEmail.split("@");// @thi email split krva
    const dbPath = emailParts[0]; // 1st index mate


    // signout thta realtimedatabase update thse..
     update(ref(db, "users/" + dbPath), {
      status: "offline",
    });

    navigate("/");
    alert("You Logout Successfully.");
  };
  console.log(users);

  
  return (
    <>
      <div className="relative">
        {users?.map((user, index) => {
          return (
            <div key={index} className="chat-container">
              <div
                href="#"
                className="block m-12 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <Link to={`/message/${user.id}`}>
                {/*    /message/${user.id}  app.js ma email set thse je link dwara Message.jsx ma lai shkay..   */}
                  <div className="flex">
                    <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                      {/* jo user.fname hoy to && fname ni length 0 n hoy to.. */}
                      {user.fname && user.fname.length > 0 && (
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          {user.fname[0]}
                        </span>
                      )}
                    </div>
                    <h2 className="ml-4 my-auto">
                      Chatting with {user.fname} {user.lname}
                    </h2>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center pt-4 pb-4">
        <button
          onClick={(e) => signoutUser(e)}
          type="submit"
          className="px-16 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Sign Out
        </button>
      </div>
    </>
  );
};

export default Chat;
