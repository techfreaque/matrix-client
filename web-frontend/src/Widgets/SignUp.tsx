import React, { useState } from "react";
import {
  initializeMatrixClient,
  registerMatrixUser,
} from "../lib/matrixClient/MatrixClient";
import { MatrixClient } from "matrix-js-sdk";

const SignUp = ({
  onSignUpSuccess,
}: {
  onSignUpSuccess: (client: MatrixClient) => void;
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const client: MatrixClient = initializeMatrixClient("https://matrix.org"); // Use your server here
      const registerResponse = await registerMatrixUser(username, password);
      console.log("dsdsad", registerResponse);
      onSignUpSuccess(client); // Notify parent component of successful registration
    } catch (error) {
      console.log("dsdsad_err", error);
      setError("Sign-up failed");
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
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
        <button type="submit">Sign Up</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SignUp;
