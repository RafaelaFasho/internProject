import { useState } from "react";
import { TextField, MenuItem, Button, InputAdornment } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import "../index.css";
import solunaLogo from "../assets/solunaLogo.png";
import axiosInstance from "../utils/axios";

const countryCodes = [
  { code: "+355", label: "Albania", flag: "🇦🇱" },
  { code: "+1", label: "United States", flag: "🇺🇸" },
  { code: "+44", label: "United Kingdom", flag: "🇬🇧" },
];

const validationSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  birthdate: yup
    .string()
    .matches(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/,
      "Birthday must be in DD/MM/YYYY format"
    )
    .required("Birthday is required"),
  phone: yup
    .string()
    .min(5, "Phone number is too short")
    .required("Phone number is required"),
  username: yup
    .string()
    .min(3, "Username should be at least 3 characters")
    .required("Username is required"),
  password: yup
    .string()
    .min(6, "Password should be at least 6 characters")
    .required("Password is required"),
});

function Register() {
  const [selectedCode, setSelectedCode] = useState("+355");
  const navigate = useNavigate();

  function convertToISO(dateStr: string): string {
    const [day, month, year] = dateStr.split("/");
    const isoString = new Date(
      `${year}-${month}-${day}T00:00:00.000Z`
    ).toISOString();
    return isoString;
  }

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      birthdate: "",
      phone: "",
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const payload = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          birthdate: convertToISO(values.birthdate),
          phone: selectedCode + values.phone,
          username: values.username,
          password: values.password,
        };

        const response = await axiosInstance.post(
          "/authentication/register",
          payload
        );

        if (response.status === 201 || response.status === 200) {
          localStorage.setItem("registeredUser", JSON.stringify(payload));

          alert("Account created successfully!");

          navigate("/login");
        } else {
          setStatus("Something went wrong, please try again.");
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.data) {
            setStatus(error.response.data.message || "Registration failed");
          } else {
            setStatus("Registration failed due to network or server error");
            /* console.log(
              `${import.meta.env.VITE_API_URL}/authentication/register`
            );*/
          }
        } else {
          setStatus("An unexpected error occurred");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="register-page">
      <div className="logo-container">
        <img src={solunaLogo} alt="Soluna Logo" className="soluna-logo" />
      </div>
      <div className="register-box">
        <div className="register-form">
          <div className="register-title-content">
            <h2 className="register-title">Set up your account</h2>
            <p className="register-subtitle">
              Please complete all information to create your account on Soluna
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="register-fields-form">
            <div className="register-fields">
              <label>First Name</label>
              <TextField
                name="firstName"
                variant="outlined"
                fullWidth
                placeholder="Your first name"
                className="text-field"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </div>

            <div className="register-fields">
              <label>Last Name</label>
              <TextField
                name="lastName"
                variant="outlined"
                fullWidth
                placeholder="Your last name"
                className="text-field"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </div>

            <div className="register-fields">
              <label>Email</label>
              <TextField
                name="email"
                variant="outlined"
                fullWidth
                placeholder="Your email"
                className="text-field"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </div>

            <div className="register-fields">
              <label>Birthday</label>
              <TextField
                name="birthdate"
                variant="outlined"
                fullWidth
                placeholder="DD/MM/YYYY"
                className="text-field"
                value={formik.values.birthdate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.birthdate && Boolean(formik.errors.birthdate)
                }
                helperText={formik.touched.birthdate && formik.errors.birthdate}
              />
            </div>

            <div className="register-fields">
              <label>Phone Number</label>
              <TextField
                name="phone"
                variant="outlined"
                fullWidth
                className="text-field"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TextField
                        select
                        value={selectedCode}
                        onChange={(e) => setSelectedCode(e.target.value)}
                        variant="standard"
                        className="country-code"
                      >
                        {countryCodes.map((option) => (
                          <MenuItem key={option.code} value={option.code}>
                            <span role="img" aria-label={option.label}>
                              {option.flag}
                            </span>{" "}
                            {option.code}
                          </MenuItem>
                        ))}
                      </TextField>
                    </InputAdornment>
                  ),
                }}
              />
            </div>

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

            <div className="register-fields">
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

            {formik.status && (
              <p style={{ color: "red", marginTop: "10px" }}>{formik.status}</p>
            )}

            <Button
              variant="contained"
              fullWidth
              type="submit"
              disabled={formik.isSubmitting}
              className="register-button"
            >
              Create Account
            </Button>
          </form>

          <p className="register-footer">
            Have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Register;
