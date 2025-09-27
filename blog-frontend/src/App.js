import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Posts from "./pages/Posts";
import Logout from "./pages/Logout.js";

function App() {
  return (
    <Router>
      <nav style={{ 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderBottom: '1px solid #dee2e6',
        marginBottom: '20px'
      }}>
        <Link to="/signup" style={{ marginRight: '15px', color: '#007bff', textDecoration: 'none' }}>Signup</Link> 
        <Link to="/login" style={{ marginRight: '15px', color: '#007bff', textDecoration: 'none' }}>Login</Link> 
        <Link to="/posts" style={{ marginRight: '15px', color: '#007bff', textDecoration: 'none' }}>Posts</Link>
        <Link to="/logout" style={{ color: '#dc3545', textDecoration: 'none' }}>Logout</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
