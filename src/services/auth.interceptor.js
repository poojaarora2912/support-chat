import axios from "axios";
import AuthService from "./auth.service";

import { UNKNOWN_ERROR } from "../constants/error";
import { refreshOAuthToken } from "../redux/actions/user";

let isAlreadyFetchingAccessToken = false;
let subscribers = [];

const apiUrl = import.meta.env.REACT_APP_API_URL;
const apiUrlV2 = import.meta.env.REACT_APP_API_URL_V2;

const OAUTH_URL = `${apiUrlV2}/admin/auth/3.0/oauth/token`;

const CHAT_URL = `https://support.svc.paperflite.dev/api/v1`;

export default function() {
    axios.interceptors.request.use(function(config) {
      if (AuthService.isAuthenticated()) {
        const isApiRequest = (config.url.startsWith(apiUrl) || config.url.startsWith(apiUrlV2)) && !config.url.startsWith(OAUTH_URL);
        const isChatRequest = config.url.startsWith(CHAT_URL);
        if (isApiRequest || isChatRequest) {
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
        const {
          config,
          response: { status },
        } = error;
        const originalRequest = config;
  
        if (status === 401) {
          if (
            config.url.endsWith("oauth/token") ||
            config.url.endsWith("oauth/token/refresh") ||
            config.url.endsWith("logout")
          ) {
            return Promise.reject(error);
          }
  
          if (!isAlreadyFetchingAccessToken) {
            isAlreadyFetchingAccessToken = true;
            var refreshTokenValue = AuthService.getRefreshToken();
  
            refreshOAuthToken(refreshTokenValue)
              .then((token) => {
                isAlreadyFetchingAccessToken = false;
  
                console.log("token: ", token);
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
  
        console.log("Unknown error :" + error);
  
        let errorMessage = "";
  
        if (error.response && error.response.data) {
          return Promise.reject(error.response.data);
        } else {
          return Promise.reject({
            code: UNKNOWN_ERROR,
            message: "Oops, Unable to complete the request",
          });
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
  