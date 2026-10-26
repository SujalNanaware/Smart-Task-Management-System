import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/layout/ThemeToggle";
import {
  ArrowRight,
  Check,
  CheckSquare,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";
import "./LoginPage.css";

export default function LoginPage({ onLogin, darkMode, setDarkMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [currentYear] = useState(() => new Date().getFullYear());
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError("Enter your email address and password to continue.");
      return;
    }

    if (typeof onLogin !== "function") {
      setError("Sign in is unavailable right now. Please try again.");
      return;
    }

    try {
      await onLogin(email, password);
      navigate("/dashboard");
    } catch (loginError) {
      setError(loginError.message || "Unable to sign in. Please try again.");
    }
  };

  return (
    <Box className="login-page">
      <Box className="login-layout">
        <Box component="aside" className="login-showcase">
          <Link className="login-brand" to="/login" aria-label="TaskFlow home">
            <span className="login-brand-mark">
              <CheckSquare size={21} strokeWidth={2.4} />
            </span>
            <span>
              Task<span>Flow</span>
            </span>
          </Link>

          <Box className="showcase-copy">
            <span className="showcase-kicker">
              <Sparkles size={14} />
              YOUR WORK, IN FLOW
            </span>
            <Typography component="h1" className="showcase-heading">
              Make every day
              <br />
              <span>count.</span>
            </Typography>
            <Typography className="showcase-description">
              Bring your tasks, goals, and team into one calm, focused
              workspace.
            </Typography>

            <Box className="showcase-preview">
              <Box className="preview-topline">
                <span className="preview-window-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="preview-status">
                  <span />
                  YOUR WEEK
                </span>
              </Box>
              <Typography className="preview-title">
                A little progress adds up.
              </Typography>
              <Box className="preview-progress-track">
                <span />
              </Box>
              <Box className="preview-footer">
                <span>Weekly progress</span>
                <strong>72%</strong>
              </Box>
              <Box className="preview-checklist">
                <span className="preview-check">
                  <Check size={12} />
                </span>
                <span>Plan your priorities</span>
                <span className="preview-tag">DONE</span>
              </Box>
              <Box className="preview-checklist">
                <span className="preview-check preview-check-active">
                  <span />
                </span>
                <span>Make meaningful progress</span>
                <span className="preview-tag preview-tag-active">TODAY</span>
              </Box>
            </Box>
          </Box>

          <Typography className="showcase-footnote">
            A clearer head starts with a clearer plan.
          </Typography>
          <span className="showcase-orb showcase-orb-one" />
          <span className="showcase-orb showcase-orb-two" />
        </Box>

        <Box component="main" className="login-main">
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          <Box className="login-card">
           
            
            <Typography component="h2" className="login-heading">
              Sign in to TaskFlow
            </Typography>
            <Typography className="login-subheading">
              Your next productive day starts here.
            </Typography>

            {error && (
              <Alert
                severity="error"
                className="login-error"
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            <Box
              component="form"
              className="login-form"
              onSubmit={handleLogin}
              noValidate
            >
              <label className="login-field-label" htmlFor="login-email">
                Email address
              </label>
              <TextField
                id="login-email"
                className="login-input"
                fullWidth
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={17} />
                    </InputAdornment>
                  ),
                }}
              />

              <Box className="login-password-label">
                <label className="login-field-label" htmlFor="login-password">
                  Password
                </label>
                <button
                  className="forgot-password"
                  type="button"
                  onClick={() =>
                    setError("Password reset is not available yet. Please contact your workspace administrator.")
                  }
                >
                  Forgot password?
                </button>
              </Box>
              <TextField
                id="login-password"
                className="login-input"
                fullWidth
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockKeyhole size={17} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        className="password-visibility-button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((visible) => !visible)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                className="login-submit"
                fullWidth
                endIcon={<ArrowRight size={17} />}
              >
                Sign in
              </Button>
            </Box>

            <Box className="login-security-note">
              <LockKeyhole size={14} />
              <Typography>Your workspace is private and secure.</Typography>
            </Box>
            <Box className="login-signup">
              <Typography>New to TaskFlow?</Typography>
              <Link to="/register">Create an account</Link>
            </Box>
          </Box>

          <Typography className="login-copyright">
            © {currentYear} TaskFlow. Built for better workdays.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
