
import { combineReducers } from "redux";
import { LOGOUT_USER } from "../../constants/actionTypes";

import AuthService from "../../services/auth.service";
import userReducer from "./userReducer";
import selectionReducer from "./selectionReducer";



const appReducer = combineReducers({
    user: userReducer,
    selection: selectionReducer,
});

export const rootReducer = (state, action) => {
    if (action.type == LOGOUT_USER) {
      state = undefined;
      AuthService.clearAccessToken();
    }
  
    return appReducer(state, action);
  };

export default rootReducer;
