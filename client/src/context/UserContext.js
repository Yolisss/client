import { createContext, useState } from "react";
import Cookies from "js-cookie";
import { api } from "../utils/apiHelper";

const UserContext = createContext(null);

//provides data throughout the app
//in index.js, app component is wrapped in UserProvider tags
//all components in app can get access to the data we pass to UserContext
export const UserProvider = (props) => {
  //if cookies.get finds a cookie name authenticatedUser
  //then cookie will equal the value stored
  //if there's no authenticatedUser cookie, cookie = null
  const cookie = Cookies.get("authenticatedUser");
  const [authUser, setAuthUser] = useState(cookie ? JSON.parse(cookie) : null);
  const signIn = async (credentials) => {
    //6.
    const response = await api("/users", "GET", null, credentials);
    if (response.status === 200) {
      //7. storing user's info
      //to get access to the user's info from response, we'll
      //need to parse response's body text to json
      const user = await response.json();
      setAuthUser(user);
      //store authenticated data
      //first arg: specifies the name of the cookie set
      //sec: string value to store in the cookie
      //third: how long to store the data
      //authenticatedUser cookie is set and valid across the entire app
      //CREATE COOKIES
      Cookies.set("authenticatedUser", JSON.stringify(user), { expires: 1 });
      return user;
    } else if (response.status === 401) {
      return null;
    } else {
      //if status is not a 200 or 401
      throw new Error();
    }
  };
  const signOut = () => {
    setAuthUser(null);
    //DELETE COOKIES
    Cookies.remove("authenticatedUser");
  };
  return (
    <UserContext.Provider
      value={{
        authUser,
        actions: {
          signIn,
          signOut,
        },
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
export default UserContext;
