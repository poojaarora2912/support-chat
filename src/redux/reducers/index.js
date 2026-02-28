import userReducer from "./userReducer";
import selectionReducer from "./selectionReducer";
import chatResponseReducer from "./chatResponseReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    user: userReducer,
    selection: selectionReducer,
    chatResponse: chatResponseReducer,
});

export default rootReducer;