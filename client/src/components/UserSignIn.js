import { useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import ErrorsDisplay from "./ErrorsDisplay";

const UserSignIn = () => {
  //coming from folder 'context', file UserContext, and grabbing actions provided from
  //Provider
  const { actions } = useContext(UserContext);
  const navigate = useNavigate();

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

    try {
      const user = await actions.signIn(credentials);
      if (user) {
        navigate("/");
      }
    } catch (err) {
      setErrors(err);
    }
  };
  const handleCancel = (event) => {
    event.preventDefault();
    //9.
    navigate("/");
  };
  return (
    <main>
      <div className="form--centered">
        <h2>Sign In</h2>
        <ErrorsDisplay errors={errors} />
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
    </main>
  );
};

export default UserSignIn;
