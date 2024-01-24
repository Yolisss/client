import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import ReactMarkdown from "react-markdown";

const CourseDetail = () => {
  const [course, setCourse] = useState({});
  const [error, setError] = useState([]);

  const { id } = useParams();
  const { authUser } = useContext(UserContext);
  console.log(authUser, "auth user is here");
  const navigate = useNavigate();

  const estimatedTime = course.estimatedTime;
  const title = course.title;
  const description = course.description;
  const materialsNeeded = course.materialsNeeded;
  //use useEffect since we are retrieving data from api
  //fetch(URL/:id)
  //parse to json
  //setCourse to new data?

  // Fetch course info
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${id}`);
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.log("Error fetching course details", error);
      }
    };
    fetchCourse();
  }, [id, navigate]);

  // event handlers
  const handleDelete = async (event) => {
    event.preventDefault();

    // use btoa method to encode user credentials
    const encodedCredentials = btoa(
      `${authUser.emailAddress}:${authUser.password}`
    );

    const fetchOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/json; charset=utf-8",
      },
    };

    // Send DELETE request
    try {
      const response = await fetch(
        `http://localhost:5000/api/courses/${id}`,
        fetchOptions
      );
      // If successfully deleted, navigate back to home route
      if (response.status === 204) {
        console.log(`${course.title} was successfully deleted!`);
        navigate("/");
        // If unauthorized, navigate to forbidden route
      } else if (response.status === 403) {
        const data = await response.json();
        setError(data.error);
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // console.log(course, authUser);
  //id, title, description, estimatedTime, materialsNeeded
  return (
    <div>
      <div className="actions--bar">
        <div className="wrap">
          {authUser && authUser.id === course?.user?.id ? (
            <>
              <a className="button" href={`${course.id}/update`}>
                Update Course
              </a>
              <a
                className="button"
                href={`${course.id}`}
                onClick={handleDelete}
              >
                Delete Course
              </a>
            </>
          ) : null}
          <a className="button button-secondary" href="/">
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
              <p>By Bob</p>
              <ReactMarkdown>{description}</ReactMarkdown>
            </div>
            <div>
              <h3 className="course--detail--title">Estimated Time</h3>
              <p>{estimatedTime}</p>
              <h3 className="course--detail--title">Materials Needed</h3>
              <ul className="course--detail--list">
                <ReactMarkdown>{materialsNeeded}</ReactMarkdown>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseDetail;
