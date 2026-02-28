import userReducer from "./userReducer";
import selectionReducer from "./selectionReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    user: userReducer,
    selection: selectionReducer,
});

export default rootReducer;