import React from "react";
import { useSelector } from "react-redux";
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import AuthService from "./services/auth.service";
import LoginPage from "./pages/login";
import MainPage from "./pages/main";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
        {/* Catch-all: show login for any other path (e.g. extension loads with unexpected path) */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

function ProtectedRoute({ children }) {
  const reduxAuthenticated = useSelector(
    (state) => state.user?.authentication?.authenticated
  );
  const isAuthenticated =
    reduxAuthenticated === true || AuthService.isAuthenticated();

  if (!isAuthenticated) {
    return <LoginPage />;
  }
  return children;
}

export default App;
