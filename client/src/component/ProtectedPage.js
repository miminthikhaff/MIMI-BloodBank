import React, { useEffect } from "react";
import { message } from "antd";
// Correct import statement
import { GetCurrentUser } from "../apicalls/users";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../redux/usersSlice";
import { setLoading } from "../redux/loaderSlice";
import { getLoggedInUserName } from "../utils/helper";
import { current } from "@reduxjs/toolkit";

function ProtectedPage({ children }) {
  const { currentUser } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getCurrentUser = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetCurrentUser(); // Correct function name
      console.log(response, "response");
      if (response.success) {
        message.success(response.message);
        dispatch(setCurrentUser(response.data));
        dispatch(setLoading(false));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.log(error, "error");
      message.error(error.message);
    }
  };
  // getCurrentUser(); don't need anymore kept this to get to know we face error here in getCurrentUser
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    currentUser && (
      <div>
        {/* header */}
        <div className="flex items-center justify-between px-5 py-3 text-white bg-primary" mx- rounded-b>
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <h1 className="text-2xl">MIMI BLOODBANK</h1>
            <span className="text-xs">
              {currentUser.userType.toUpperCase()}
            </span>
          </div>

          <div className="flex gap-1 item-center">
            <i className="ri-shield-user-fill"></i>
            <div className="flex flex-col">
              <span
                className="mr-5 cursor-pointer text-md"
                onClick={() => navigate("/profile")}
              >
                {getLoggedInUserName(currentUser).toUpperCase()}
              </span>
            </div>

            <i
              class="ri-logout-circle-r-line ml5 cursor-pointer"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            ></i>

            <div className="ml-5"></div>
          </div>
        </div>

        {/* {body} */}
        <div className="px-5 py-5">{children}</div>
      </div>
    )
  );
}

export default ProtectedPage;
