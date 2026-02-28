import { type UnknownAction } from "@reduxjs/toolkit";

import {
  LOGOUT_USER,
  FETCHING_COGNITO_ACCESS_TOKEN,
  FETCHING_COGNITO_ACCESS_TOKEN_SUCCEEDED,
  FETCHING_COGNITO_ACCESS_TOKEN_FAILED,
} from "../../constants/actionTypes";

interface UserState {
  authentication: {
    authenticated: boolean;
    authenticating: boolean;
    error: string | null;
    accessToken?: unknown;
  };
}

const initialState: UserState = {
  authentication: {
    authenticated: false,
    authenticating: false,
    error: null,
  },
};

const userReducer = (state = initialState, action: UnknownAction) => {
  switch (action.type) {
    case FETCHING_COGNITO_ACCESS_TOKEN:
      return {
        ...state,
        authentication: {
          ...state.authentication,
          authenticating: true,
          error: null,
        },
      };

    case FETCHING_COGNITO_ACCESS_TOKEN_SUCCEEDED:
      return {
        ...state,
        authentication: {
          ...state.authentication,
          authenticating: false,
          authenticated: true,
          accessToken: action.payload,
        },
      };

    case FETCHING_COGNITO_ACCESS_TOKEN_FAILED:
      return {
        ...state,
        authentication: {
          ...state.authentication,
          authenticating: false,
          authenticated: false,
          error: action.payload,
        },
      };

    case LOGOUT_USER:
      return initialState;

    default:
      return state;
  }
};

export default userReducer;
