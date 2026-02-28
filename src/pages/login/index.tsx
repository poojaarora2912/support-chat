import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import buildUrl from "build-url-ts";

import { AUTH_LOGIN_SUCCESS_EVENT } from "../../constants/auth";
import AuthService from "../../services/auth.service";
import styles from "./style.module.scss";

const env = (import.meta as unknown as { env?: Record<string, string> }).env;
const API_URL_V2 = env?.REACT_APP_API_URL_V2 ?? "";

export default function LoginPage() {
  return (
    <div className={styles.content}>
      {/* <div className={styles.left}>
        <div className={styles.inner}>
          <img src="/images/paperflite.jpg" alt="Logo" className={styles.logo} />
          <h1 className={styles.heading}>Paperflite Support Chat</h1>
        </div>
      </div> */}
      <div className={styles.right}>
        <SignInForm />
      </div>
    </div>
  );
}

function SignInForm() {
  const navigate = useNavigate();
  const [fetchingToken, setFetchingToken] = useState(false);
  const listenerRef = useRef<(e: MessageEvent) => void>(() => {});

  const handleAuthenticateEvent = useCallback(
    async (e: MessageEvent) => {
      if (e.data?.type !== "COGNITO_AUTHORIZATION_SUCCESS") return;

      window.removeEventListener("message", listenerRef.current);

      const { code, state, error } = e.data.payload || {};

      if (error) {
        setFetchingToken(false);
        return;
      }

      setFetchingToken(true);
      try {
        const response = await axios.get(
          `${API_URL_V2}/admin/auth/3.0/oauth/token`,
          { params: { code, state } }
        );
        if (response.status === 200) {
          const { access_token, refresh_token } = response.data;
          AuthService.saveToken(access_token, refresh_token);
          window.dispatchEvent(new CustomEvent(AUTH_LOGIN_SUCCESS_EVENT));
          navigate("/");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        navigate(`/login?error=${encodeURIComponent(message)}`);
      } finally {
        setFetchingToken(false);
      }
    },
    [navigate]
  );

  const stableListener = useCallback((e: MessageEvent) => {
    handleAuthenticateEvent(e);
  }, [handleAuthenticateEvent]);

  listenerRef.current = stableListener;

  function handleAuthenticate(e: React.FormEvent) {
    e.preventDefault();

    const dualScreenLeft =
      window.screenLeft !== undefined ? window.screenLeft : 400;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : 400;
    const width = window.innerWidth ?? document.documentElement.clientWidth ?? 1280;
    const height = window.innerHeight ?? document.documentElement.clientHeight ?? 800;
    const w = Math.floor(0.8 * width);
    const h = Math.floor(0.8 * height);
    const left = width / 2 - w / 2 + dualScreenLeft;
    const top = height / 2 - h / 2 + dualScreenTop;

    const url = buildUrl(API_URL_V2, { path: "/admin/auth/3.0/login" });
    const newWindow = window.open(
      url,
      "Authorize Cognito User Account",
      `scrollbars=yes,width=${w},height=${h},top=${top},left=${left}`
    );
    if (newWindow?.focus) newWindow.focus();

    window.addEventListener("message", stableListener);
  }

  useEffect(() => () => {
    window.removeEventListener("message", stableListener);
  }, [stableListener]);

  return (
    <div className={styles.form}>
      <h2 className={styles.header}>
        Sign in to Paperflite Support Chat!
      </h2>
      <form className={styles.formInner} onSubmit={handleAuthenticate}>
        <button
          type="submit"
          className={styles.btnAwsLogin}
          disabled={fetchingToken}
        >
          {fetchingToken ? "Signing in…" : "Sign in with AWS Cognito"}
        </button>
      </form>
    </div>
  );
}
