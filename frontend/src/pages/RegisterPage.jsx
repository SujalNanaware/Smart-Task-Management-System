import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/layout/ThemeToggle";
import {
  ArrowRight,
  AtSign,
  Check,
  CheckSquare,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import "./LoginPage.css";
import "./RegisterPage.css";

const passwordRules = [
  { label: "At least 8 characters", test: (value) => value.length >= 8 },
  { label: "One uppercase letter", test: (value) => /[A-Z]/.test(value) },
  { label: "One number", test: (value) => /\d/.test(value) },
];

export default function RegisterPage({ darkMode, setDarkMode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [currentYear] = useState(() => new Date().getFullYear());
  const navigate = useNavigate();

  const passwordScore = passwordRules.filter((rule) => rule.test(password)).length;
  const passwordStrength = ["", "Weak", "Fair", "Strong"][passwordScore];

  const handleRegister = (event) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Complete all fields to create your account.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    if (passwordScore < passwordRules.length) {
      setError("Choose a stronger password that meets all the requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords don’t match. Please check and try again.");
      return;
    }

    if (!acceptedTerms) {
      setError("Please agree to the terms to continue.");
      return;
    }

    navigate("/login");
  };

  return (
    <Box className="login-page">
      <Box className="login-layout register-layout">
        <Box component="aside" className="login-showcase register-showcase">
          <Link className="login-brand" to="/register" aria-label="TaskFlow">
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
              A BETTER WAY TO GET THINGS DONE
            </span>
            <Typography component="h1" className="showcase-heading">
              Your goals,
              <br />
              <span>in motion.</span>
            </Typography>
            <Typography className="showcase-description">
              Build a workspace that keeps your focus clear and your best work
              moving forward.
            </Typography>

            <Box className="register-benefits">
              <Box className="register-benefit">
                <span><Check size={14} /></span>
                <Box>
                  <Typography className="register-benefit-title">
                    See the whole picture
                  </Typography>
                  <Typography className="register-benefit-copy">
                    Keep priorities, tasks, and progress together.
                  </Typography>
                </Box>
              </Box>
              <Box className="register-benefit">
                <span><Check size={14} /></span>
                <Box>
                  <Typography className="register-benefit-title">
                    Make progress feel simple
                  </Typography>
                  <Typography className="register-benefit-copy">
                    Turn big goals into manageable next steps.
                  </Typography>
                </Box>
              </Box>
              <Box className="register-benefit">
                <span><Check size={14} /></span>
                <Box>
                  <Typography className="register-benefit-title">
                    Find your flow
                  </Typography>
                  <Typography className="register-benefit-copy">
                    Spend less time organizing and more time doing.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Typography className="showcase-footnote">
            A clearer head starts with a clearer plan.
          </Typography>
          <span className="showcase-orb showcase-orb-one" />
          <span className="showcase-orb showcase-orb-two" />
        </Box>

        <Box component="main" className="login-main register-main">
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          <Box className="login-card register-card">
            
            <Typography component="h2" className="login-heading">
              Create your account
            </Typography>
            <Typography className="login-subheading">
              Set up your workspace in just a few steps.
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
              className="login-form register-form"
              onSubmit={handleRegister}
              noValidate
            >
              <label className="login-field-label" htmlFor="register-name">
                Full name
              </label>
              <TextField
                id="register-name"
                className="login-input"
                fullWidth
                placeholder="How should we address you?"
                autoComplete="name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError("");
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <UserRound size={17} />
                    </InputAdornment>
                  ),
                }}
              />

              <label className="login-field-label" htmlFor="register-email">
                Email address
              </label>
              <TextField
                id="register-email"
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
                      <AtSign size={17} />
                    </InputAdornment>
                  ),
                }}
              />

              <label className="login-field-label" htmlFor="register-password">
                Password
              </label>
              <TextField
                id="register-password"
                className="login-input register-password-input"
                fullWidth
                placeholder="Create a strong password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
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

              {password.length > 0 && (
                <Box className="password-strength" aria-live="polite">
                  <Box className="password-strength-heading">
                    <Typography>Password strength</Typography>
                    <strong className={`strength-label strength-${passwordStrength.toLowerCase()}`}>
                      {passwordStrength}
                    </strong>
                  </Box>
                  <Box
                    className={`password-strength-track strength-level-${passwordScore}`}
                  >
                    <span />
                    <span />
                    <span />
                  </Box>
                </Box>
              )}

              <Box className="password-rules">
                {passwordRules.map((rule) => {
                  const passed = rule.test(password);
                  return (
                    <Box
                      className={`password-rule${passed ? " password-rule-passed" : ""}`}
                      key={rule.label}
                    >
                      <Check size={12} />
                      <Typography>{rule.label}</Typography>
                    </Box>
                  );
                })}
              </Box>

              <label
                className="login-field-label register-confirm-label"
                htmlFor="register-confirm-password"
              >
                Confirm password
              </label>
              <TextField
                id="register-confirm-password"
                className="login-input register-confirm-input"
                fullWidth
                placeholder="Enter your password again"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setError("");
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockKeyhole size={17} />
                    </InputAdornment>
                  ),
                }}
              />

              <Box className="register-terms">
                <Checkbox
                  checked={acceptedTerms}
                  onChange={(event) => {
                    setAcceptedTerms(event.target.checked);
                    setError("");
                  }}
                  size="small"
                  inputProps={{ "aria-label": "Agree to the terms and privacy policy" }}
                />
                <Typography>
                  I agree to the <span>Terms of Service</span> and{" "}
                  <span>Privacy Policy</span>.
                </Typography>
              </Box>

              <Button
                type="submit"
                className="login-submit"
                fullWidth
                endIcon={<ArrowRight size={17} />}
              >
                Create account
              </Button>
            </Box>

            
            <Box className="login-signup">
              <Typography>Already have an account?</Typography>
              <Link to="/login">Sign in</Link>
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
