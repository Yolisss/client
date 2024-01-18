//import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/courses")
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);

  return (
    <>
      <ul>
        {courses.map((course) => (
          <li>{courses.title}</li>
        ))}
      </ul>
    </>

    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;

//create a get req to server
//server is located localost:5000
//req, res
//return list of courses
//iterate through list of courses by using loop
//return title of each one
//map
