import React, { useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import buildUrl from "build-url-ts";

import { fetchOAuthToken } from "../../redux/actions/user";
import styles from "./style.module.scss";

const env = (import.meta as unknown as { env?: Record<string, string> }).env;
const API_URL_V2 = env?.REACT_APP_API_URL_V2 ?? "";

export default function LoginPage() {
  return (
    <div className={styles.content}>
      <div className={styles.right}>
        <SignInForm />
      </div>
    </div>
  );
}

function SignInForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authenticating, authenticated, error } = useSelector((state: { user?: { authentication?: { authenticating?: boolean; authenticated?: boolean; error?: string | null } } }) => state.user?.authentication ?? {});
  const listenerRef = useRef<(e: MessageEvent) => void>(() => {});

  const handleAuthenticateEvent = useCallback(
    (e: MessageEvent) => {
      if (e.data?.type !== "COGNITO_AUTHORIZATION_SUCCESS") return;

      window.removeEventListener("message", listenerRef.current);

      const { code, state, error: payloadError } = e.data.payload || {};

      if (payloadError) {
        return;
      }

      dispatch(fetchOAuthToken({ code, state }));
    },
    [dispatch]
  );

  useEffect(() => {
    if (authenticated) {
      navigate("/");
    }
  }, [authenticated, navigate]);

  useEffect(() => {
    if (error) {
      navigate(`/login?error=${encodeURIComponent(error)}`);
    }
  }, [error, navigate]);

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
    <div className={styles.formCard}>
      <div className={styles.form}>
        <img src="/images/paperflite.svg" alt="Paperflite" className={styles.logo} width={72} height={72} />
        <h1 className={styles.header}>Sign in to Paperflite Support Chat</h1>
        <form className={styles.formInner} onSubmit={handleAuthenticate}>
          <button
            type="submit"
            className={styles.btnAwsLogin}
            disabled={authenticating}
          >
            {authenticating ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
