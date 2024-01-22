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
        <a key={course.id} href={`/courses/${course.id}`}>
          <h2>Course</h2>
          <h3>{course.title}</h3>
        </a>
      ))}

      {/* need to include link to "Create Course" screen */}
      <Link to="/courses/create">Create Course</Link>
    </div>
  );
}

export default Courses;
