import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { setUser } from "../redux/features/userSlice";

export default function ProtectedRoutes({ children }) {

    const dispatch = useDispatch();
    const {user} = useSelector(state=>state.user)

    //getuser
    // eslint-disable-next-line
    const getUser = async()=>{
        try {
            dispatch(showLoading());
            const res = await axios.post("/api/v1/user/getUserData",{token: localStorage.getItem("token")},
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    // or you can write Authorization: "Bearer " + localStorage.getItem("token"),
                  },
                }
              );
              dispatch(hideLoading());
              if (res.data.success) {
                // By storing the user data in the Redux store, it becomes accessible to any component that needs it. Components can use the useSelector hook to access the user state from the Redux store and retrieve the user data.
                dispatch(setUser(res.data.data)); // userController mei authcontroller wala dekho
              } else {
                localStorage.clear();
                <Navigate to="/login" />;
                localStorage.clear();
              }
        } catch (error) {
            dispatch(hideLoading());
            localStorage.clear();
            console.log(error)
        }
    }

    useEffect(()=>{
        if(!user){
            getUser();
        }
    },[user,getUser])
    // if any one of user or getuser changes then useffect will rerender.

  if (localStorage.getItem("token")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}