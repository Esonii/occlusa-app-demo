import { useState, FormEvent } from "react";
import { useAuth } from "./AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const { login } = useAuth();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoggingIn(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message ?? "Failed to log in");
    } finally {
      setLoggingIn(false);
    }
  }

  return (
    <div style={{ 
      padding: "2rem", 
      maxWidth: "400px", 
      margin: "0 auto",
      backgroundColor: "#1a1a1a",
      color: "#fff",
      minHeight: "100vh"
    }}>
      <h1 style={{ marginBottom: "2rem" }}>Admin Login</h1>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loggingIn}
          style={{ 
            padding: "0.75rem", 
            fontSize: "1rem",
            backgroundColor: "#2a2a2a",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: "4px"
          }}
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loggingIn}
          style={{ 
            padding: "0.75rem", 
            fontSize: "1rem",
            backgroundColor: "#2a2a2a",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: "4px"
          }}
        />
        
        {error && (
          <div style={{ color: "#ff6b6b", fontSize: "0.875rem" }}>
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loggingIn}
          style={{
            padding: "0.75rem",
            fontSize: "1rem",
            backgroundColor: loggingIn ? "#555" : "#4a9eff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: loggingIn ? "not-allowed" : "pointer"
          }}
        >
          {loggingIn ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}

