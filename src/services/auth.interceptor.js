import axios from "axios";
import AuthService from "./auth.service";

import { UNKNOWN_ERROR } from "../constants/error";
import { refreshOAuthToken } from "../redux/actions/user";

let isAlreadyFetchingAccessToken = false;
let subscribers = [];

const apiUrl = import.meta.env.REACT_APP_API_URL;
const apiUrlV2 = import.meta.env.REACT_APP_API_URL_V2;
const supportApiUrl = import.meta.env.REACT_APP_SUPPORT_API_URL || "";

const OAUTH_URL = `${apiUrlV2}/admin/auth/3.0/oauth/token`;

const isAuthenticatedRequest = (url) => {
  if (!url) return false;
  const isOAuth = url.startsWith(OAUTH_URL);
  if (isOAuth) return false;
  return (
    url.startsWith(apiUrl) ||
    url.startsWith(apiUrlV2) ||
    (supportApiUrl && url.startsWith(supportApiUrl))
  );
}

export default function() {
    axios.interceptors.request.use(function(config) {
      if (AuthService.isAuthenticated()) {
        if (isAuthenticatedRequest(config.url)) {
          config.headers.Authorization = "Bearer " + AuthService.getAccessToken();
        }
      }

      return config;
    });
  
    //Intercept response and prepare the error object
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        try {
          const config = error?.config;
          const status = error?.response?.status;
          const originalRequest = config;

          if (!config) {
            return Promise.reject(error);
          }

          if (status === 401) {
            if (
              (config.url && (
                config.url.endsWith("oauth/token") ||
                config.url.endsWith("oauth/token/refresh") ||
                config.url.endsWith("logout")
              ))
            ) {
              return Promise.reject(error);
            }

            if (!isAlreadyFetchingAccessToken) {
              isAlreadyFetchingAccessToken = true;
              var refreshTokenValue = AuthService.getRefreshToken();

              refreshOAuthToken(refreshTokenValue)
                .then((token) => {
                  isAlreadyFetchingAccessToken = false;

                  if (token && token.data && token.data.access_token) {
                    AuthService.saveAccessToken(token.data.access_token);
                    onAccessTokenFetched(token.data.access_token);
                  }
                })
                .catch((err) => {
                  isAlreadyFetchingAccessToken = false;
                  subscribers = [];

                  window.location = "/login";
                  return Promise.reject("Auth error");
                });
            }

            const retryOriginalRequest = new Promise((resolve) => {
              addSubscriber((access_token) => {
                originalRequest.headers.Authorization = "Bearer " + access_token;
                resolve(axios(originalRequest));
              });
            });

            return retryOriginalRequest;
          }

          if (error.response && error.response.data) {
            return Promise.reject(error.response.data);
          }
          return Promise.reject({
            code: UNKNOWN_ERROR,
            message: "Oops, Unable to complete the request",
          });
        } catch (interceptorError) {
          console.error("Auth interceptor error:", interceptorError);
          return Promise.reject(error);
        }
      }
    );
  }
  
  function onAccessTokenFetched(access_token) {
    subscribers = subscribers.filter((callback) => callback(access_token));
  }
  
  function addSubscriber(callback) {
    subscribers.push(callback);
  }
  