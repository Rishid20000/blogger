import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      const res = await api.post("/login", form);
      localStorage.setItem("token", res.data.token);
      setMessage("Login successful! Redirecting...");
      
      // Redirect to posts after successful login
      setTimeout(() => {
        navigate("/posts");
      }, 1000);
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.error || "Login failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      <form onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
        
        {message && (
          <p style={{
            padding: '10px',
            backgroundColor: message.includes('Error') ? '#ffebee' : '#e8f5e8',
            color: message.includes('Error') ? '#c62828' : '#2e7d32',
            borderRadius: '4px',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            {message}
          </p>
        )}
        
        <input 
          name="email" 
          type="email"
          placeholder="Email" 
          value={form.email}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }}
          required
        />
        
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={form.password}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }}
          required
        />
        
        <button 
          type="submit" 
          disabled={isLoading}
          style={{
            width: '100%',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            padding: '12px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginBottom: '15px'
          }}
        >
          {isLoading ? '🔄 Logging in...' : '🔑 Login'}
        </button>
        
        <p style={{ textAlign: 'center' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#007bff' }}>Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
