import "../../styles/signup.css";
import { BasicButton, InputBox } from "../../components/BasicComponents";
import { useState } from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { handleLoginError } from "../../utils/utils";
function Signin(props) {
  const navigate = useNavigate();
  const { setOpenSnack, setSnackData } = props;
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

  const onSubmit = async () => {
    let payload = { ...state };
    try {
      const response = await axios.post(
        "http://localhost:8000/api/token/",
        payload,
      );

      // Store tokens in localStorage or state
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("username", response.data.username);

      if (response.status === 200) {
        setOpenSnack(true);
        setSnackData({
          type: "success",
          message: "Login successfull",
        });
        navigate("/home/");
      }
    } catch (error) {
      handleLoginError(error, setOpenSnack, setSnackData);
    }
  };

  return (
    <div className="signup-main-container">
      <h1 className="signup-heading">Login</h1>

      <Box
        sx={{ "& > :not(style)": { m: 1, width: "50ch" } }}
        style={{ display: "flex", justifyContent: "center" }}
        noValidate
        autoComplete="off"
      >
        <InputBox
          required
          label="Email"
          onChange={onChange}
          value={state.username}
          name={"username"}
          type={"email"}
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
        sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
        style={{ display: "flex", justifyContent: "center" }}
        noValidate
        autoComplete="off"
      >
        <BasicButton variant={"outlined"} onClick={onSubmit} name={"Submit"} />
      </Box>
      <p style={{ cursor: "pointer", color: "blue", textAlign: "center" }}>
        <Link to="/sign-up">Don't you have an account?</Link>
      </p>
    </div>
  );
}

export default Signin;
