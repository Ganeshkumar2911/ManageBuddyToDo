import LogIn from "./LogIn";
import Buttonn from "./Button";
import SignUp from "./SignUp";
import React, { useEffect } from "react";
import { useState } from "react";
import Todo from "./Todo";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";



function App() {
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");

  const router = createBrowserRouter(
    [
      {
        path:"/",
        element: <LogIn setUserEmail={setUserEmail}/>,
      },
  
      {
        path: "/signUp",
        element: <SignUp />,
      },
      {
        path: "/Todo",
        element: <Todo userEmail = {userEmail} />
      }
    ]
  );
 
  return (
    <>
    <RouterProvider router={router}/>
    </>
  );
}

export default App;
