import { all, fork } from "redux-saga/effects";
import { userSaga } from "./actions/user";
import { chatResponseSaga } from "./actions/chatResponse";

export default function* rootSaga() {
    yield all([
        fork(userSaga),
        fork(chatResponseSaga),
    ]);
}