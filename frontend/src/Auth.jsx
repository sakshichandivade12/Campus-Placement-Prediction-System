
import { useState } from "react";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import "./Auth.css";

const API_URL = "http://127.0.0.1:5000";

export default function Auth({ onBack, onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isRegister = mode === "register";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    setLoading(true);

    try {
      const endpoint = isRegister
        ? "/api/auth/register"
        : "/api/auth/login";

      const payload = isRegister
        ? { name: name.trim(), email: email.trim(), password }
        : { email: email.trim(), password };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Something went wrong.");
      }

      if (isRegister) {
        setSuccess("Account created successfully! You can now log in.");
        setMode("login");
        setPassword("");
      } else {
        if (!data.user) {
          throw new Error("Login succeeded, but user details were not returned.");
        }

        onAuthSuccess?.(data.user);
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the server. Please check that Flask is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-topbar">
        <button className="auth-back" onClick={onBack} type="button">
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <div className="auth-brand">
          <span className="auth-brand-icon">
            <GraduationCap size={23} />
          </span>
          <span>GetPlaced</span>
        </div>
      </div>

      <section className="auth-layout">
        <div className="auth-intro">
          <span className="auth-eyebrow">YOUR CAREER STARTS HERE</span>
          <h1>
            Take the next step
            <br />
            toward your <span>dream career.</span>
          </h1>
          <p>
            Evaluate your placement readiness, understand your strengths,
            and prepare for your campus placement journey.
          </p>

          <div className="auth-benefit">
            <CheckCircle2 size={19} />
            <span>ML-powered placement predictions</span>
          </div>
          <div className="auth-benefit">
            <CheckCircle2 size={19} />
            <span>Insights based on your academic profile</span>
          </div>
          <div className="auth-benefit">
            <CheckCircle2 size={19} />
            <span>Personalized placement preparation tips</span>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-heading">
            <h2>{isRegister ? "Create your account" : "Welcome back!"}</h2>
            <p>
              {isRegister
                ? "Join GetPlaced and start preparing."
                : "Log in to continue your placement journey."}
            </p>
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
              }}
            >
              Log In
            </button>
            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => {
                setMode("register");
                setError("");
                setSuccess("");
              }}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="auth-message auth-error" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-message auth-success" role="status">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <label className="auth-field">
                <span>Full name</span>
                <div className="auth-input-wrap">
                  <User size={18} />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
              </label>
            )}

            <label className="auth-field">
              <span>Email address</span>
              <div className="auth-input-wrap">
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="auth-field">
              <span>Password</span>
              <div className="auth-input-wrap">
                <Lock size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    isRegister ? "At least 8 characters" : "Enter your password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                  minLength={isRegister ? 8 : undefined}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : isRegister
                  ? "Create Account"
                  : "Log In"}
            </button>
          </form>

          <p className="auth-switch">
            {isRegister ? "Already have an account?" : "New to GetPlaced?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(isRegister ? "login" : "register");
                setError("");
                setSuccess("");
              }}
            >
              {isRegister ? "Log in" : "Create an account"}
            </button>
          </p>

          <p className="auth-security">
            Your password is securely hashed by the backend.
          </p>
        </div>
      </section>

      <footer className="auth-footer">
        GetPlaced · Campus Placement Prediction System
      </footer>
    </main>
  );
}