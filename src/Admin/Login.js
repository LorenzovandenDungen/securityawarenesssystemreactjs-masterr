import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import './AdminLoginPage.css'; // import the styles

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      console.log('Logging in...');
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in successfully!');
      // Redirect to admin dashboard
      navigate('/admindashboard');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  

  return (
    <div className="admin-login-container">
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin}>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <label>
          <span>Email:</span>
          <input type="email" value={email} onChange={handleEmailChange} />
        </label>
        <label>
          <span>Password:</span>
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
