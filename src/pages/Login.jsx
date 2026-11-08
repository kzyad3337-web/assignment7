
import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { user, login, loading, error } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/cart" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const success = await login(username, password);

    if (success) {
      navigate("/cart");
    }
  }

  return (
    <section>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>Demo username: admin</p>
      <p>Demo password: 123456</p>
    </section>
  );
}

export default Login;
