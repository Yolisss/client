import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
//grabbing user data that is being distributed throughout app
import UserContext from "../context/UserContext";

const CreateCourse = () => {
  const { authUser } = useContext(UserContext);
  //vlad q, why array
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();
  //specifically grabbing authUser from context

  const title = useRef(null);
  const description = useRef(null);
  const estimatedTime = useRef(null);
  const materialsNeeded = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newCourse = {
      title: title.current.value,
      description: description.current.value,
      estimatedTime: estimatedTime.current.value,
      materialsNeeded: materialsNeeded.current.value,
    };

    //store encoded credientials
    //from authUser (context) we're grabbing email and password
    const encodedCredentials = btoa(
      `${authUser.emailAddress}:${authUser.password}`
    );

    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        //type of authorization we're using and passing in our credentials
        Authorization: `Basic ${encodedCredentials}`,
      },
      body: JSON.stringify(newCourse),
    };

    try {
      if (authUser) {
        const response = await fetch(
          "http://localhost:5000/api/courses",
          fetchOptions
        );
        console.log(response);
        if (response.status === 201) {
          console.log(`${newCourse.title} was successfully created!`);
        } else if (response.status === 400) {
          const data = await response.JSON();
          setErrors(data.errors);
        } else {
          throw new Error();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(authUser, "useruser");

  const handleCancel = (event) => {
    event.preventDefault();
    //9.
    navigate("/");
  };
  return (
    <div>
      <div className="wrap">
        <form onSubmit={handleSubmit}>
          <div className="main--flex">
            <div>
              <label htmlFor="courseTitle">Course Title</label>
              <input
                id="courseTitle"
                name="courseTitle"
                type="text"
                ref={title}
              />
              <p>By someone</p>
              <label htmlFor="courseDescription">Course Description</label>
              <textarea
                id="courseDescription"
                name="courseDescription"
                ref={description}
              />
            </div>
            <div>
              <label htmlFor="estimatedTime">Estimated Time</label>
              <input
                id="estimatedTime"
                name="estimatedTime"
                type="text"
                ref={estimatedTime}
              />
              <label htmlFor="materialsNeeded">Materials Needed</label>
              <textarea
                id="materialsNeeded"
                name="materialsNeeded"
                ref={materialsNeeded}
              />
            </div>
          </div>
          <button className="button" type="submit">
            Create Course
          </button>
          <button className="button button-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
