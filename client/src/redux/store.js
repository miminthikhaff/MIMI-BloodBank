import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./usersSlice";
import loadersReducer from "./loaderSlice";

const store = configureStore({
    reducer: {
        users: usersReducer,
        loaders: loadersReducer,
    },
});

//reducer == userSlice


export default store;