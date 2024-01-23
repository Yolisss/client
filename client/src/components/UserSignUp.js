import { useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import ErrorsDisplay from "./ErrorsDisplay";

const UserSignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  //state
  const firstName = useRef(null);
  const lastName = useRef(null);
  const emailAddress = useRef(null);
  const password = useRef(null);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    //where we'll store value from user
    const user = {
      firstName: firstName.current.value,
      lastName: lastName.current.value,
      emailAddress: emailAddress.current.value,
      password: password.current.value,
    };

    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(user),
    };

    const response = await fetch(
      "http://localhost:5000/api/users",
      fetchOptions
    );
    console.log(response);
    if (response.status === 201) {
      console.log(
        `${user.firstName} ${user.lastName} is successfully signed up and authenticated`
      );
    } else if (response.status === 400) {
      const data = await response.json();
      setErrors(data.errors);
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    navigate("/");
  };
  return (
    <div>
      <div className="form--centered">
        <h2>Sign Up</h2>
        <ErrorsDisplay errors={errors} />
        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            defaultValue
            ref={firstName}
          />
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            defaultValue
            ref={lastName}
          />
          <label htmlFor="emailAddress">Email Address</label>
          <input
            id="emailAddress"
            name="emailAddress"
            type="email"
            defaultValue
            ref={emailAddress}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            defaultValue
            ref={password}
          />
          <button className="button" type="submit">
            Sign Up
          </button>
          <button className="button button-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </form>
        <p>
          Already have a user account? Click here to{" "}
          <Link to="/signin">sign in</Link>!
        </p>
      </div>
    </div>
  );
};

export default UserSignUp;
