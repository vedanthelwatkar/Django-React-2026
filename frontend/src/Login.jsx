import { Button, Input, message } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "./redux/slice/UserSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = () => {
    dispatch(loginUser({ username, password }))
      .unwrap()
      .then(() => {
        message.success("Login successful");
        navigate("/");
      })
      .catch(() => message.error("Invalid credentials"));
  };

  return (
    <div className="flex items-center justify-center h-dvh flex-col w-full gap-2 p-40">
      <Input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input.Password
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={submit}>Login</Button>
    </div>
  );
};

export default Login;
