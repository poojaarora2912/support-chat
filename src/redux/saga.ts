import { all, fork } from "redux-saga/effects";
import { userSaga } from "./actions/user";

export default function* rootSaga() {
    yield all([
        fork(userSaga),
    ]);
}