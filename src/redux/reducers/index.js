
import { combineReducers } from "redux";
import { LOGOUT_USER } from "../../constants/actionTypes";

import AuthService from "../../services/auth.service";
import userReducer from "./userReducer";
import selectionReducer from "./selectionReducer";
import evaluationReducer from "./evaluationReducer";
import chatResponseReducer from "./chatResponseReducer";

const appReducer = combineReducers({
    user: userReducer,
    selection: selectionReducer,
    evaluation: evaluationReducer,
    chatResponse: chatResponseReducer,
});

export const rootReducer = (state, action) => {
    if (action.type == LOGOUT_USER) {
      state = undefined;
      AuthService.clearAccessToken();
    }
  
    return appReducer(state, action);
  };

export default rootReducer;
