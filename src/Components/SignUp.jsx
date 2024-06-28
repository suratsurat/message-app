import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithPopup,
} from "firebase/auth";
import { app } from "../firebase";
import { ref, set } from "firebase/database";
import { db } from "../firebase";

const gprovider = new GoogleAuthProvider();

const auth = getAuth(app);

const SignUp = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const writeUserData = (e) => {
    e.preventDefault();
    //user email&pass thi create thse jo authentication thse...
    createUserWithEmailAndPassword(auth, email, pass)
      .then(() => {
        e.preventDefault();
        navigate("/signIn");
        // real time database ma nicheni values store thse..
        var onlyemailname = email.split("@")[0];
        set(ref(db, "users/" + onlyemailname), {
          email: email,
          password: pass,
          fname: fname,
          lname: lname,
          status: "offline",
        }).catch((err) => console.log(err));
      })
      .catch(() => {
        alert("You Entered Invalid Details. Please try again.");
      });
  };

  //For Google SignUp
  const signUpWithGoogle = (e) => {
    e.preventDefault();
    signInWithPopup(auth, gprovider)
      .then((res) => {
        console.log(res);
        // .replace(/\./g, "") => jo email ma "." hase to "" thay jse.
        // .split("@")[0] => @thi email split thse ane teni 1st index etle k [0] lese.
        var onlyemailname = res.user.email.replace(/\./g, "").split("@")[0];
        set(ref(db, "users/" + onlyemailname), {
          email: res.user.email,
          fname: res.user.displayName.split(" ")[0].replace(/\d/g, " "),
          lname: res.user.displayName.split(" ")[1].replace(/\d/g, " "),
          status: "offline",
        })
        //localstorage ma "email" key thi res.user.email store thse.
        localStorage.setItem("email", res.user.email)
        navigate("/chat");
      }) 
      .catch(() => {
        alert("You SignIn With Invalid Email. Please try again with another email.");
      });
  };


  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="flex flex-col justify-center">
            <h1 className="leading-snug	 mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              <center>Sign Up For Enjoying Chat App</center>
            </h1>
            <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
              Here at we focus on offering real-time messaging and seamless user
              interactions, designed for effortless communication and
              collaboration.
            </p>
          </div>
          <div>
            <div className="w-full lg:max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow-xl dark:bg-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Sign Up to Chat App
              </h2>
              <form
                className="mt-8 space-y-6"
                onSubmit={(e) => writeUserData(e)}
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
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
                    onChange={(e) => {
                      setPass(e.target.value);
                    }}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="firstname"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    First Name
                  </label>
                  <input
                    type="name"
                    name="fname"
                    id="fname"
                    placeholder="First Name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={fname}
                    onChange={(e) => {
                      setFname(e.target.value);
                    }}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastname"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Last Name
                  </label>
                  <input
                    type="lame"
                    name="lname"
                    id="lname"
                    placeholder="Last Name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={lname}
                    onChange={(e) => {
                      setLname(e.target.value);
                    }}
                    required
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="mt-3 px-20 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Sign Up
                  </button>
                </div>

                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  <span className="flex justify-center text-blue-600 hover:underline dark:text-blue-500">
                    <span onClick={signUpWithGoogle}>Sign Up With Google</span>
                  </span>
                </div>

                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  <span className="flex justify-center text-blue-600 hover:underline dark:text-blue-500">
                    <Link to="/signIn">Signin</Link>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
