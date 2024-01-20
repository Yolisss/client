import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const CourseDetail = () => {
  const [course, setCourse] = useState([]);
  const { id } = useParams();

  const estimatedTime = course.estimatedTime;
  const title = course.title;
  const description = course.description;
  const materialsNeeded = course.materialsNeeded;
  //use useEffect since we are retrieving data from api
  //fetch(URL/:id)
  //parse to json
  //setCourse to new data?

  useEffect(() => {
    try {
      fetch(`http://localhost:5000/api/courses/${id}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setCourse(data);
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

  console.log(course);
  //id, title, description, estimatedTime, materialsNeeded
  return (
    <div>
      <div className="actions--bar">
        <div className="wrap">
          <a className="button" href="update-course.html">
            Update Course
          </a>
          <a className="button" href="#">
            Delete Course
          </a>
          <a className="button button-secondary" href="index.html">
            Return to List
          </a>
        </div>
      </div>
      <div className="wrap">
        <h2>Course Detail</h2>
        <form>
          <div className="main--flex">
            <div>
              <h3 className="course--detail--title">Course</h3>
              <h4 className="course--name">{title}</h4>
              <p>{description}</p>
            </div>
            <div>
              <h3 className="course--detail--title">Estimated Time</h3>
              <p>{estimatedTime}</p>
              <h3 className="course--detail--title">Materials Needed</h3>
              <ul className="course--detail--list">{materialsNeeded}</ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseDetail;
