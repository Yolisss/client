import { useState, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import UserContext from "../context/UserContext";

const UserSignIn = () => {
  //coming from folder 'context', file UserContext, and grabbing actions provided from
  //Provider
  const { actions } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  // State
  const emailAddress = useRef(null);
  const password = useRef(null);
  const [errors, setErrors] = useState([]);
  // Event Handlers
  //1. writing async since func is bringing back a promise
  const handleSubmit = async (event) => {
    event.preventDefault();

    //client passes the authentication info to server
    //and in an auth header Base 64 encoding
    //creating credentials obj that will hold email and password
    const credentials = {
      emailAddress: emailAddress.current.value,
      password: password.current.value,
    };

    //store encoded credientials
    const encodedCredentials = btoa(
      `${credentials.emailAddress}:${credentials.password}`
    );

    //"we want to get the user's info"
    const fetchOptions = {
      metod: "GET",
      //credentials need to be passed in an auth header
      //using basic auth scheme
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/users",
        fetchOptions
      );
      //this if statement will return user's data such as
      //{id:4, firstName: 'yolis', lastName: 'zac' email..etc}
      if (response.status === 200) {
        const user = await response.json();
        console.log(`${user.firstName} is now signed in`);
        navigate("/");
      } else if (response.status === 401) {
        //VLAD: why in []?
        setErrors(["Sign-in was unsuccessful"]);
      } else {
        throw new Error();
      }
    } catch (err) {
      console.log(err);
      //navigate("/error")
    }
  };
  const handleCancel = (event) => {
    event.preventDefault();
    //9.
    navigate("/");
  };
  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="emailAddress">Email Address</label>
        <input
          id="emailAddress"
          name="emailAddress"
          type="email"
          ref={emailAddress}
        />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" ref={password} />
        <button className="button" type="submit">
          Sign In
        </button>
        <button className="button button-secondary" onClick={handleCancel}>
          Cancel
        </button>
      </form>
      <p>
        Don't have a user account? Click here to{" "}
        <Link to="/signup">sign up</Link>!
      </p>
    </div>
  );
};

export default UserSignIn;
