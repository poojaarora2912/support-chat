import axios from "axios";
import buildUrl from "build-url-ts";
import { createAction } from "redux-actions";
import { call, put, takeEvery } from "redux-saga/effects";
import { FETCHING_CHAT_RESPONSE, FETCHING_CHAT_RESPONSE_SUCCEEDED, FETCHING_CHAT_RESPONSE_FAILED, INVALIDATE_CHAT_RESPONSE } from "../../constants/actionTypes";
const env = (import.meta as unknown as { env: Record<string, string> }).env;
const API_URL = env.REACT_APP_API_URL;
const API_URL_V2 = env.REACT_APP_API_URL_V2;

const CHAT_URL = `https://support.svc.paperflite.dev/api/v1/support_chat/chat`;

export const fetchChatResponse = createAction(FETCHING_CHAT_RESPONSE);
export const fetchingChatResponseSucceeded = createAction(FETCHING_CHAT_RESPONSE_SUCCEEDED);
export const fetchingChatResponseFailed = createAction(FETCHING_CHAT_RESPONSE_FAILED);

function* fetchChatResponseSaga(action) {
    const { message, sessionId } = action.payload;

    const fetchChatResponseAPI = (data: { query: string; session_id: string }) => {
      return axios({
        method: "POST",
        url: CHAT_URL,
        data: {
          query: data.query,
          session_id: data.session_id,
        },
      }).then((response) => response.data);
    };

    try {
      const response = yield call(fetchChatResponseAPI, { query: message, session_id: sessionId });
      console.log('response', response)
      const payload = {
        ...response,
        query: message,
      }
      yield put(fetchingChatResponseSucceeded(payload));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const payload = {
        error: message,
        query: message,
      }
      yield put(fetchingChatResponseFailed(payload));
    }
  }

export const invalidateChatResponse = createAction(INVALIDATE_CHAT_RESPONSE);

export function* chatResponseSaga() {
    yield takeEvery(FETCHING_CHAT_RESPONSE, fetchChatResponseSaga);
}