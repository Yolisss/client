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
  const handleSubmit = async () => {
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
    };

    //send PUT request
    try {
      //if we get correct user, and user's id === user's course id
      if (authUser && authUser.id === course.userId) {
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
    <div>
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
                defaultValue="Build a Basic Bookcase"
              />
              <p>By Joe Smith</p>
              <label htmlFor="courseDescription">Course Description</label>
              <textarea
                id="courseDescription"
                name="courseDescription"
                defaultValue={
                  "High-end furniture projects are great to dream about. But unless you have a well-equipped shop and some serious woodworking experience to draw on, it can be difficult to turn the dream into a reality.\n\nNot every piece of furniture needs to be a museum showpiece, though. Often a simple design does the job just as well and the experience gained in completing it goes a long way toward making the next project even better.\n\nOur pine bookcase, for example, features simple construction and it's designed to be built with basic woodworking tools. Yet, the finished project is a worthy and useful addition to any room of the house. While it's meant to rest on the floor, you can convert the bookcase to a wall-mounted storage unit by leaving off the baseboard. You can secure the cabinet to the wall by screwing through the cabinet cleats into the wall studs.\n\nWe made the case out of materials available at most building-supply dealers and lumberyards, including 1/2 x 3/4-in. parting strip, 1 x 2, 1 x 4 and 1 x 10 common pine and 1/4-in.-thick lauan plywood. Assembly is quick and easy with glue and nails, and when you're done with construction you have the option of a painted or clear finish.\n\nAs for basic tools, you'll need a portable circular saw, hammer, block plane, combination square, tape measure, metal rule, two clamps, nail set and putty knife. Other supplies include glue, nails, sandpaper, wood filler and varnish or paint and shellac.\n\nThe specifications that follow will produce a bookcase with overall dimensions of 10 3/4 in. deep x 34 in. wide x 48 in. tall. While the depth of the case is directly tied to the 1 x 10 stock, you can vary the height, width and shelf spacing to suit your needs. Keep in mind, though, that extending the width of the cabinet may require the addition of central shelf supports."
                }
              />
            </div>
            <div>
              <label htmlFor="estimatedTime">Estimated Time</label>
              <input
                id="estimatedTime"
                name="estimatedTime"
                type="text"
                defaultValue="14 hours"
              />
              <label htmlFor="materialsNeeded">Materials Needed</label>
              <textarea
                id="materialsNeeded"
                name="materialsNeeded"
                defaultValue={
                  "* 1/2 x 3/4 inch parting strip\n\n* 1 x 2 common pine\n\n* 1 x 4 common pine\n\n* 1 x 10 common pine\n\n* 1/4 inch thick lauan plywood\n\n* Finishing Nails\n\n* Sandpaper\n\n* Wood Glue\n\n* Wood Filler\n\n* Minwax Oil Based Polyurethane"
                }
              />
            </div>
          </div>
          <button className="button" type="submit">
            Update Course
          </button>
          <button className="button button-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};
export default UpdateCourse;
