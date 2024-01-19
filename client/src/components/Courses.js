import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data));
  }, []);

  return (
    <div>
      {courses.map((course) => (
        <h3 key={course.id}>{course.title}</h3>
      ))}

      {/* need to include link to "Create Course" screen */}
    </div>
  );
}

export default Courses;
