import { useState, useContext, useEffect } from "react";
import UserContext from "../context/UserContext";
import { useParams, useNavigate } from "react-router-dom";

const UpdateCourse = () => {
  const [course, setCourse] = useState({});
  const [errors, setErrors] = useState([]);
  const [updatedCourse, setUpdatedCourse] = useState({
    title: "",
    description: "",
    estimatedTime: "",
    materialsNeeded: "",
  });

  const { id } = useParams();
  const { authUser } = useContext(UserContext);
  const navigate = useNavigate();

  //whenever there's a change in id from our URL
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${id}`);
        if (response.status === 200) {
          const data = await response.json();
          setCourse(data);
          setUpdatedCourse(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCourse();
  }, [id]);

  //event handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    //handling credentials
    //store encoded credientials
    const encodedCredentials = btoa(
      `${authUser.emailAddress}:${authUser.password}`
    );
    //"we want to UPDATE the user's info"
    const fetchOptions = {
      method: "PUT",
      //credentials need to be passed in an auth header
      //using basic auth scheme
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(updatedCourse),
    };

    //send PUT request
    try {
      //if we get correct user, and user's id === user's course id
      if (authUser && authUser.id === course.user.id) {
        const response = await fetch(
          `http://localhost:5000/api/courses/${id}`,
          fetchOptions
        );
        // If successfully updated, navigate to course detail page
        if (response.status === 204) {
          console.log(`${course.title} was successfully updated!`);
          navigate(`/courses/${id}`);
          // Set errors for missing title and/or description
        } else if (response.status === 400) {
          const data = await response.json();
          setErrors(data.errors);
        } else {
          throw new Error();
        }
      }
    } catch (error) {
      console.log(error);
      navigate("/error");
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    navigate("/");
  };
  //because user is dealing w form, we will do
  //handleSubmit func
  //include useEffect since we're grabbing data from an api
  //grab specific course based of its id
  //by doing a get req
  return (
    <div className="wrap">
      <h2>Update Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="main--flex">
          <div>
            <label htmlFor="courseTitle">Course Title</label>
            <input
              id="courseTitle"
              name="courseTitle"
              type="text"
              value={updatedCourse.title}
              onChange={(e) =>
                setUpdatedCourse({ ...updatedCourse, title: e.target.value })
              }
            />
            {course.User && (
              <p>
                By {course.User.firstName} {course.User.lastName}
              </p>
            )}
            <label htmlFor="courseDescription">Course Description</label>
            <textarea
              id="courseDescription"
              name="courseDescription"
              type="text"
              value={updatedCourse.description}
              onChange={(e) =>
                setUpdatedCourse({
                  ...updatedCourse,
                  description: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label htmlFor="estimatedTime">Estimated Time</label>
            <input
              id="estimatedTime"
              name="estimatedTime"
              type="text"
              value={updatedCourse.estimatedTime}
              onChange={(e) =>
                setUpdatedCourse({
                  ...updatedCourse,
                  estimatedTime: e.target.value,
                })
              }
            />
            <label htmlFor="materialsNeeded">Materials Needed</label>
            <textarea
              id="materialsNeeded"
              name="materialsNeeded"
              value={updatedCourse.materialsNeeded}
              onChange={(e) =>
                setUpdatedCourse({
                  ...updatedCourse,
                  materialsNeeded: e.target.value,
                })
              }
            />
          </div>
        </div>
        <button className="button" type="submit" onClick={handleSubmit}>
          Update Course
        </button>
        <button className="button button-secondary" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};
export default UpdateCourse;
