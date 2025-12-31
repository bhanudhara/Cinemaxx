import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";

const SignIn: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User signed up:", user);
        localStorage.setItem("user", JSON.stringify({ email: user.email, provider: "password" }));
        navigate("/");
      })
      .catch((error) => {
        if (error.code === "auth/operation-not-allowed") {
          setError("Email/password sign-up is not enabled in Firebase Auth (enable it in the console).");
        } else {
          setError(error.message);
        }
        console.error("Error during sign up:", error.code, error.message);
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
      <h1>Sign Up</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input autoComplete="name" type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input autoComplete="email" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input autoComplete="new-password" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input autoComplete="new-password" type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn">Sign Up</button>
        <br />
      </form>
      <span> Sign up With Google ? </span>
      <button onClick={signupWithGoogle}> Google </button>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default SignIn;