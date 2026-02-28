import axios from "axios";
import buildUrl from "build-url-ts";
import { createAction } from "redux-actions";
import { call, put, takeEvery } from "redux-saga/effects";
import { FETCHING_COGNITO_ACCESS_TOKEN, FETCHING_COGNITO_ACCESS_TOKEN_FAILED, FETCHING_COGNITO_ACCESS_TOKEN_SUCCEEDED } from "../../constants/actionTypes";

const env = (import.meta as unknown as { env: Record<string, string> }).env;
const API_URL = env.REACT_APP_API_URL;
const API_URL_V2 = env.REACT_APP_API_URL_V2;

const OAUTH_URL = `${API_URL_V2}/admin/auth/3.0/oauth/token`;
const REFRESH_TOKEN_URL = `${OAUTH_URL}/refresh`;

/** fetch oauth access token */
export const fetchOAuthToken = createAction(FETCHING_COGNITO_ACCESS_TOKEN);
export const fetchingOAuthTokenSucceeded = createAction(FETCHING_COGNITO_ACCESS_TOKEN_SUCCEEDED);
export const fetchingOAuthTokenFailed = createAction(FETCHING_COGNITO_ACCESS_TOKEN_FAILED);

function* fetchOAuthTokenSaga() {
    const fetchOAuthTokenAPI = () => {
      return axios({
        method: "GET",
        url: OAUTH_URL,
      }).then((response) => response.data);
    };
  
    try {
      const response = yield call(fetchOAuthTokenAPI);
      yield put(fetchingOAuthTokenSucceeded(response));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      yield put(fetchingOAuthTokenFailed(message));
    }
  }

/** cognito: refresh oauth access token */
export function refreshOAuthToken(refresh_token) {
    const data = {
      refresh_token,
    };
  
    return axios({
      method: "GET",
      url: REFRESH_TOKEN_URL,
      params: data,
    });
  }

export function* userSaga() {
    yield takeEvery(FETCHING_COGNITO_ACCESS_TOKEN, fetchOAuthTokenSaga);
}