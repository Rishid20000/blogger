import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleLogout = () => {
    try {
      // Remove the token from localStorage
      localStorage.removeItem("token");
      setMessage("Successfully logged out!");
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setMessage("Error logging out");
    }
  };

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("token");

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h2>Logout</h2>
      {message && (
        <p style={{ 
          padding: '10px', 
          backgroundColor: message.includes('Error') ? '#ffebee' : '#e8f5e8',
          color: message.includes('Error') ? '#c62828' : '#2e7d32',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          {message}
        </p>
      )}
      
      {isLoggedIn ? (
        <>
          <p>Are you sure you want to logout?</p>
          <button 
            onClick={handleLogout}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              marginBottom: '15px'
            }}
          >
            🚪 Logout
          </button>
        </>
      ) : (
        <p>You are not currently logged in.</p>
      )}
      
      <p>
        <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>← Back to Login</Link>
        {' | '}
        <Link to="/posts" style={{ color: '#007bff', textDecoration: 'none' }}>View Posts</Link>
      </p>
    </div>
  );
}

export default Logout;
