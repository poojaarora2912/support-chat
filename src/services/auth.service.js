import buildUrl from "build-url-ts";
import axios from "axios";

const apiUrl = import.meta.env.REACT_APP_API_URL;

export default class AuthService {
    static isAuthenticated() {
        return window.localStorage.token != null;
      }

      static getAccessToken() {
        return window.localStorage.token;
      }
    
      static getRefreshToken() {
        return window.localStorage.refresh_token;
      }
    
      static saveAccessToken(token) {
        window.localStorage.setItem("token", token);
      }

      static saveToken(token, refresh_token) {
        window.localStorage.setItem("token", token);
        window.localStorage.setItem("refresh_token", refresh_token);
      }
    
      static clearAccessToken() {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("refresh_token");
      }

      static getURL(relativeURL, queryParams) {
        if (relativeURL) {
          var params = queryParams || {};
    
          params = {
            ...params,
            access_token: this.getAccessToken(),
          };
    
          return buildUrl(apiUrl, {
            path: relativeURL,
            queryParams: params,
          });
        }
        return null;
      }
    
}