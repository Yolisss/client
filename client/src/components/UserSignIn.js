import { useState, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import UserContext from "../context/UserContext";

const UserSignIn = () => {
  //this context variable is now equal to the obj we passed to
  //the value prop in UserContext.Provider:
  //<UserContext.Provider value={{
  //   authUser,
  //   actions: {
  //     signIn
  //   }
  // }}>

  //coming from folder 'context', file UserContext, and grabbing actions provided from
  //Provider
  const { actions } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  // State
  const email = useRef(null);
  const password = useRef(null);
  const [errors, setErrors] = useState([]);
  // Event Handlers
  //1. writing async since func is bringing back a promise
  const handleSubmit = async (event) => {
    event.preventDefault();
    //from will contain the path we'll navigate the user to
    // once they sign in
    //ex once i sign in, it'll take me to the courses page instead of sign in
    let from = "/";
    if (location.state) {
      from = location.state.from;
    }
    //3. encoding user's credentials and adding to req header
    const credentials = {
      email: email.current.value,
      password: password.current.value,
    };
    try {
      const user = await actions.signIn(credentials);
      if (user) {
        navigate(from);
      } else {
        setErrors(["Sign in was unsuccessful"]);
      }
    } catch (error) {
      console.log(error);
      navigate("/error");
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
        <input id="emailAddress" name="emailAddress" type="email" ref={email} />
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
