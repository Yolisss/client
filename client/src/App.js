//import logo from "./logo.svg";
import "./App.css";
//import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Courses from "./components/Courses";
import UserSignIn from "./components/UserSignIn";
import UserSignUp from "./components/UserSignUp";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Courses />} />
        <Route path="/signin" element={<UserSignIn />} />
        <Route path="/signup" element={<UserSignUp />} />
      </Routes>
    </div>
  );
}

export default App;
