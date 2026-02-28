import { all, fork } from "redux-saga/effects";
import { userSaga } from "./actions/user";
import { evaluationSaga } from "./actions/evalutation";

export default function* rootSaga() {
    yield all([
        fork(userSaga),
        fork(evaluationSaga),
    ]);
}