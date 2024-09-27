import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../slices/auth.js";
import chatReducer from "../slices/chat.js";
import miscReducer from "../slices/misc.js";

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  misc: miscReducer,
});

export default rootReducer;
