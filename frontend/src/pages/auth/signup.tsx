import "../../styles/signup.css";
import { BasicButton, InputBox } from "../../components/BasicComponents";
import { useState } from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { handleLoginError } from "../../utils/utils";

function Signup(props) {
  const { setOpenSnack, setSnackData } = props;

  const navigate = useNavigate();
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onChange = (e) => {
    if (e) {
      let name = e.target.name;
      let value = e.target.value;

      setState({ ...state, [name]: value });
    }
  };

  const Validation = () => {
    let isError = false;
    let errorMessage = "";

    if (!state.name) {
      isError = true;
      errorMessage = "Name is not provided!";
    } else if (!state.email) {
      isError = true;
      errorMessage = "Email is not provided!";
    } else if (!state.password || !state.confirmPassword) {
      isError = true;
      errorMessage = "PAssword is not provided!";
    } else if (state.password !== state.confirmPassword) {
      isError = true;
      errorMessage = "PAssword not match!";
    }

    return { isError, errorMessage };
  };

  const onSubmit = async () => {
    let { isError, errorMessage } = Validation();

    if (isError) {
      setOpenSnack(true);
      setSnackData({
        type: "error",
        message: errorMessage,
      });
    } else {
      let payload = { ...state };
      try {
        const response = await axios.post(
          "http://localhost:8000/api/signup/",
          payload,
        );
        if (response.status === 200) {
          setOpenSnack(true);
          setSnackData({
            type: "success",
            message: "User created successfully",
          });

          navigate("/sign-in/");
        }
      } catch (error) {
        handleLoginError(error, setOpenSnack, setSnackData);
      }
    }
  };

  return (
    <div className="signup-main-container">
      <h1 className="signup-heading">Signup</h1>
      <Box
        sx={{ "& > :not(style)": { m: 1, width: "50ch" } }}
        style={{ display: "flex", justifyContent: "center" }}
        noValidate
        autoComplete="off"
      >
        <InputBox
          label="Full Name"
          onChange={onChange}
          value={state.name}
          name={"name"}
        />
      </Box>

      <Box
        sx={{ "& > :not(style)": { m: 1, width: "50ch" } }}
        style={{ display: "flex", justifyContent: "center" }}
        noValidate
        autoComplete="off"
      >
        <InputBox
          label="Email"
          onChange={onChange}
          value={state.email}
          name={"email"}
        />
      </Box>

      <Box
        sx={{ "& > :not(style)": { m: 1, width: "50ch" } }}
        style={{ display: "flex", justifyContent: "center" }}
        noValidate
        autoComplete="off"
      >
        <InputBox
          required
          label="Password"
          onChange={onChange}
          value={state.password}
          name={"password"}
          type={"password"}
        />
      </Box>

      <Box
        sx={{ "& > :not(style)": { m: 1, width: "50ch" } }}
        style={{ display: "flex", justifyContent: "center" }}
        noValidate
        autoComplete="off"
      >
        <InputBox
          required
          label="Confirm Password"
          onChange={onChange}
          value={state.confirmPassword}
          name={"confirmPassword"}
          type={"password"}
        />
      </Box>

      <Box
        sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
        style={{ display: "flex", justifyContent: "center" }}
        noValidate
        autoComplete="off"
      >
        <BasicButton variant={"outlined"} onClick={onSubmit} name={"Submit"} />
      </Box>
      <p style={{ cursor: "pointer", color: "blue", textAlign: "center" }}>
        <Link to="/sign-in">Already have an account?</Link>
      </p>
    </div>
  );
}

export default Signup;
