import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import "../index.css";
import solunaLogo from "../assets/solunaLogo.png";
import axiosInstance from "../utils/axios";
import { ACCESS_TOKEN } from "../constants/constants";

const validationSchema = yup.object({
  userName: yup
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
      userName: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError("");
      try {
        const response = await axiosInstance.post(
          "/authentication/login",
          {
            userName: values.userName,
            password: values.password,
          },
          {
            headers: {
              "Content-Type": "application/json-patch+json",
              accept: "*/*",
            },
          }
        );

        if (response.status === 200) {
          // console.log(" Full login response:", response.data);
          localStorage.setItem(ACCESS_TOKEN, response.data.token);
          /*console.log(
            "Saved access token:",
            localStorage.getItem(ACCESS_TOKEN)
          );*/

          alert("Login successful!");
          navigate("/home");
        } else {
          setError("Invalid credentials. Please try again.");
        }
      } catch (err: any) {
        console.log("Login error:", err);
        console.log("Error response:", err.response);
        setError("Login failed. Please check your username and password.");
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <div className="page">
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
                name="userName"
                variant="outlined"
                fullWidth
                placeholder="Your username"
                className="text-field"
                value={formik.values.userName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.userName && Boolean(formik.errors.userName)
                }
                helperText={formik.touched.userName && formik.errors.userName}
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

            {error && <p style={{ color: "red" }}>{error}</p>}

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
