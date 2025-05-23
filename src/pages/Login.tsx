import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import "../index.css";
import solunaLogo from "../assets/solunaLogo.png";

const validationSchema = yup.object({
  username: yup
    .string()
    .min(3, "Username should be at least 3 characters")
    .required("Username is required"),
  password: yup
    .string()
    .min(6, "Password should be at least 6 characters")
    .required("Password is required"),
});

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post("/api/authentication/login", values);
        if (response.status === 200) {
          alert("Login successful!");
          navigate("/dashboard");
        } else {
          setError("Invalid credentials. Please try again.");
        }
      } catch (err) {
        setError("Login failed. Please check your username and password.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="login-page">
      <div className="logo-container">
        <img src={solunaLogo} alt="Soluna Logo" className="soluna-logo" />
      </div>
      <div className="login-box">
        <div className="login-form">
          <div className="login-title-content">
            <h2 className="login-title">Log in into Soluna</h2>
            <p className="login-subtitle">
              Enter your username and password to log in into the app
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="login-fields-form">
            <div className="register-fields">
              <label>Username</label>
              <TextField
                name="username"
                variant="outlined"
                fullWidth
                placeholder="Your username"
                className="text-field"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
              />
            </div>

            <div className="login-fields">
              <label>Password</label>
              <TextField
                name="password"
                type="password"
                variant="outlined"
                fullWidth
                placeholder="Your password"
                className="text-field"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
            </div>

            {error && (
              <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
            )}

            <Button
              variant="contained"
              fullWidth
              type="submit"
              disabled={formik.isSubmitting}
              className="login-button"
            >
              Log In
            </Button>
          </form>

          <p className="login-footer">
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
