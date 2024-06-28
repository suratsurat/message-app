import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { app, db } from "../firebase";
import { ref, update } from "firebase/database";

const auth = getAuth(app);

const SignIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const signinUser = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, pass)
      .then(() => {
        // alert("Sign In Successfully");

        localStorage.setItem("email", email);
        navigate("/chat");
      })
      .catch(() => {
        alert("You Entered Invalid email or password. Please try again.");
      });
  };


  // jo logginpage ni tab badlse to status: offline thy jse 
  // Not Needed...
              useEffect(() => {
                const loggedInUserEmail = localStorage.getItem("email");

                const handleWindowClose = () => {
                  updateStatus();
                };

                const handleTabChange = () => {
                  if (document.visibilityState === "hidden") {
                    updateStatus();
                    signoutUser();
                  }
                };
                window.addEventListener("beforeunload", handleWindowClose);
                document.addEventListener("visibilitychange", handleTabChange);
                const updateStatus = () => {
                  update(ref(db, `users/${loggedInUserEmail.split("@")[0]}`), {
                    status: "offline",
                  });
                };
                const signoutUser = (e) => {
                  e.preventDefault();
                  const userEmail = localStorage.getItem("email");
                  const cleanedEmail = userEmail.replace(/\./g, "");
                  const emailParts = cleanedEmail.split("@");
                  const dbPath = emailParts[0];
              
                  update(ref(db, "users/" + dbPath), {
                    status: "offline",
                  });
                  navigate("/");
                  alert("You Logout Successfully.");
                };
                return () => {
                  window.removeEventListener("beforeunload", handleWindowClose);
                  document.removeEventListener("visibilitychange", handleTabChange);
                };
              }, []);


return (
    <>
      <div className="flex justify-center p-3">
        <div
          className="rounded-lg overflow-hidden shadow-2xl hover:shadow-lg w-full my-36"
          style={{ boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.2)" }}
        >
          <div className="p-8 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sign In to Chat App
            </h2>
            <form
              className="mt-8 space-y-6"
              onSubmit={(e) => {
                signinUser(e);
              }}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-3 py-2 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Sign In
              </button>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Not registered yet?{" "}
                <span className="text-blue-600 hover:underline dark:text-blue-500">
                  <Link to="/">Create account</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
