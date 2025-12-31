import React, { createContext, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/login";
import SignIn from "./components/signin";
import NotFoundPage from "./components/NotFoundPage";
import "./App.css";
import { auth } from "./components/firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

export const AuthContext = createContext<User | null>(null);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        localStorage.setItem(
          "user",
          JSON.stringify({ email: u.email, provider: (u as any).providerId || "firebase" })
        );
      } else {
        localStorage.removeItem("user");
      }
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={user}>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/signin" element={!user ? <SignIn /> : <Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthContext.Provider>
  );
};

export default App;
