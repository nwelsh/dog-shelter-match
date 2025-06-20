import { useState } from "react";
import "./Login.scss";
import FetchLogo from "../assets/Images/fetch-logo.jpg";

type LoginProps = {
  onLogin: (email: string, name: string) => void;
};

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, name);
  };

  return (
    <div className="main">
      <img src={FetchLogo} alt="fetch-logo" className="logo"></img>
      <form className="form" onSubmit={handleSubmit}>
        <h2 className="login__header">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          className="input"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          required
          className="input"
          onChange={(e) => setName(e.target.value)}
        />
        <button className="login-button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
