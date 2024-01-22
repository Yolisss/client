import { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const CourseDetail = () => {
  const [course, setCourse] = useState([]);
  const { id } = useParams();
  const { authUser } = useContext(UserContext);
  const navigate = useNavigate();

  const estimatedTime = course.estimatedTime;
  const title = course.title;
  const description = course.description;
  const materialsNeeded = course.materialsNeeded;
  //use useEffect since we are retrieving data from api
  //fetch(URL/:id)
  //parse to json
  //setCourse to new data?

  //grabbing a specific course
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
  }, [id, navigate]);

  //delete handler
  const handleDelete = async (event) => {
    event.preventDefault();

    //store encoded credientials
    const encodedCredentials = btoa(
      `${authUser.emailAddress}:${authUser.password}`
    );

    //"we want to DELETE the user's info"
    const fetchOptions = {
      method: "DELETE",
      //credentials need to be passed in an auth header
      //using basic auth scheme
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/json; charset=utf-8",
      },
    };

    //send DELETE request
    try {
      const response = await fetch(
        `http://localhost:5000/api/courses/${id}`,
        fetchOptions
      );
      if (response.status === 204) {
        console.log(`${course.title} was successfully deleted`);
        navigate("/");
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(course);
  //id, title, description, estimatedTime, materialsNeeded
  return (
    <div>
      <div className="actions--bar">
        <div className="wrap">
          {authUser && authUser.id === course.userId ? (
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
