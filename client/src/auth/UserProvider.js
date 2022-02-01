import { useState, useEffect } from "react";
import UserContext from "./UserContext";
import { useNavigate } from "react-router-dom";
import APIHandler from "../api/APIHandler";

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    authenticateUser();
  }, []);

  const authenticateUser = (clbk) => {
    APIHandler.get(`${process.env.REACT_APP_BACKEND_URL}/is-loggedin`)
      .then(({ data }) => {
        setIsLoggedIn(true);
        console.log("logged");
        setCurrentUser(data.currentUser);
        setIsLoading(false);
        if (clbk) {
          clbk();
        }
      })
      .catch((e) => {
        console.log("not logged");
        setCurrentUser(null);
        setIsLoading(false);
        setIsLoggedIn(false);
      });
  };

  const removeUser = (clbk) => {
    APIHandler.post(`${process.env.REACT_APP_BACKEND_URL}/signout`).finally(
      () => {
        setCurrentUser(null);
        setIsLoading(false);
        setIsLoggedIn(false);
        navigate("/");
      }
    );
  };

  const authStatus = {
    currentUser,
    removeUser,
    isLoading,
    isLoggedIn,
    authenticateUser,
    setCurrentUser,
  };

  return (
    <UserContext.Provider value={authStatus}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
