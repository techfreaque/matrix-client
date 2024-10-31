"use client";

import React, { useState } from "react";
import {
  initializeMatrixClient,
  loginToMatrix,
} from "../lib/matrixClient/MatrixClient";
import { MatrixClient } from "matrix-js-sdk";

const Login = ({
  onLoginSuccess,
}: {
  onLoginSuccess: (client: MatrixClient) => void;
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const client: MatrixClient = initializeMatrixClient("https://matrix.org"); // Use your server here
      const loginResponse = await loginToMatrix(username, password);
      console.log("resp", loginResponse);
      onLoginSuccess(client);
    } catch (error) {
      console.log("error", error);
      setError("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Matrix username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
