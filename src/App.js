import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import SignUp from "./Components/SignUp";
import SignIn from "./Components/SignIn";
import Chat from "./Components/Chat";
import Message from "./Components/Message";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<SignUp />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/message/:email" element={<Message />} />
        </Routes>
      </BrowserRouter>
      {/* <ToastContainer /> */}
    </>
  );
}

export default App;
