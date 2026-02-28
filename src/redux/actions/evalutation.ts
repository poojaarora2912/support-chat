import axios from "axios";
import _ from "lodash";
import buildUrl from "build-url-ts";

import { call, put, takeEvery } from "redux-saga/effects";
import {
  FETCH_EVALUATION,
  FETCH_EVALUATION_SUCCEEDED,
  FETCH_EVALUATION_FAILED,
} from "../../constants/actionTypes";

const env = (import.meta as unknown as { env: Record<string, string> }).env;
const SUPPORT_API_URL = env.REACT_APP_SUPPORT_API_URL;

const AUDIT_URL = `${SUPPORT_API_URL}/api/v1/support_eval/audit`;

export const fetchEvaluation = (id: string) => {
  return {
    type: FETCH_EVALUATION,
    payload: { id },
  };
};

export const fetchEvaluationSucceeded = (evaluation: any) => {
  return {
    type: FETCH_EVALUATION_SUCCEEDED,
    payload: evaluation,
  };
};

export const fetchEvaluationFailed = (message: string) => {
  return {
    type: FETCH_EVALUATION_FAILED,
    payload: message,
  };
};

function getSerializableErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { detail?: string; message?: string } | undefined;
    return data?.detail ?? data?.message ?? error.message ?? "Failed to load evaluation.";
  }
  if (error instanceof Error) return error.message;
  return "Failed to load evaluation.";
}

export function* fetchEvaluationSaga(
    action: ReturnType<typeof fetchEvaluation>
) {
  const id = _.get(action, 'payload.id');
  const fetchEvaluationAPI = () =>
    axios
      .get(AUDIT_URL, { params: { intercom_id: id } })
      .then((response) => response.data);

  try {
    const response = yield call(fetchEvaluationAPI);
    yield put(fetchEvaluationSucceeded({ id, evaluation: response }));
  } catch (error) {
    yield put(fetchEvaluationFailed(getSerializableErrorMessage(error)));
  }
}

export function* evaluationSaga() {
  yield takeEvery(FETCH_EVALUATION, fetchEvaluationSaga);
}
