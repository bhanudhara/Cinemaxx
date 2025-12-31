import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    console.log("Login attempt with:", { email });

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User logged in:", user);
        localStorage.setItem("user", JSON.stringify({ email: user.email, provider: "password" }));
        navigate("/");
      })
      .catch((error) => {
        if (error.code === "auth/operation-not-allowed") {
          setError("Email/password sign-in is not enabled in Firebase Auth (enable it in the console).");
        } else {
          setError(error.message);
        }
        console.error("Login error:", error.code, error.message);
      });
  };

  const signupWithGoogle = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("User signed up with Google:", user);
        localStorage.setItem("user", JSON.stringify({ email: user.email, provider: "google" }));
        navigate("/");
      })
      .catch((error) => {
        setError(error.message);
        console.error("Error during Google sign up:", error.code, error.message);
      });
  };

  return (
    <div className="card">
      <h1>Login</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            autoComplete="email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            autoComplete="current-password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">Login</button>
      </form>
      <span> Sign up With Google ? </span>
      <button onClick={signupWithGoogle}> Google </button>
      <p>
        Don't have an account? <a href="/signin">Sign up</a>
      </p>
    </div>
  );
};

export default Login;