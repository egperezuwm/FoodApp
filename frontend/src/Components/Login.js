import React, { useState } from 'react';
import axios from 'axios';
import './styles/LoginLayout.css';
import './styles/LoginForm.css';
import './styles/Logo.css';
import './styles/SignUp.css';
import LoginShowcase from './LoginShowcase';



const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  // NEW USER:
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [restaurantName, setRestaurantName] = useState(''); // patched in 03/30/25
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;      
      //navigate('/dashboard');
      onLoginSuccess({ username })
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed! Please check your credentials.');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    // Connect to backend using boiler-plate code:
    if (signUpPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      // NEEDED THIS TO SIGN UP (took 2 hours to find out!!!)
      delete axios.defaults.headers.common['Authorization'];

      const res = await axios.post('http://127.0.0.1:8000/api/signup/', {
        username: signUpUsername,
        email: signUpEmail,
        password: signUpPassword,
        restaurant_name: restaurantName,  // patched in 03/30/25
      });
  
      alert("Account created successfully! You can now log in.");
      setShowSignUp(false);
  
      // Clear sign-up form
      setSignUpUsername('');
      setSignUpEmail('');
      setRestaurantName('');
      setSignUpPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Sign up failed:', err);
      alert('Sign up failed. Please try again.');
    }
  };

  return (
    <div className="FormContainer">
      <div className="LoginLayout">
        <div className="LoginPanel">
          <section className="FormPane">
            <div className="LogoArea">
              <div className='companyLogo'></div>
              <h2>SyncServe</h2> 
              {/* Up for change */}
            </div>
            <form onSubmit={handleLogin} id="LoginForm">
              <h2>Welcome Back!</h2>
              {/* <p>Hey! It's nice to have you back.</p> (removing for now)*/}
              <div>
                <input 
                  className="usernameInput"
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  placeholder="Username"
                  required 
                />
                <span onClick={() => setUsername('')}>&#120;</span>
              </div>
              <div>
                <input 
                  className="passwordInput"
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Password"
                  required 
                />
                <span onClick={() => setPassword('')}>&#120;</span>
              </div>
              <button type="submit">Login</button>

              {/* ✅ Create Account Button */}
              <button 
                type="button" 
                onClick={() => setShowSignUp(true)}
                style={{ marginTop: '10px', background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
              >
                Create an Account
              </button>
            </form>
          </section>
        </div>
        <LoginShowcase />
      </div>

      {/* Sign-Up Modal */}
      {showSignUp && (
        <div className="SignUpModalOverlay">
          <div className="SignUpModal">
            <button onClick={() => setShowSignUp(false)} className="CloseModal">&times;</button>
            <h2>Create Account</h2>
            <form onSubmit={handleSignUp}>
                        <input
                type="text"
                placeholder="Username"
                value={signUpUsername}
                onChange={(e) => setSignUpUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                required
              />
              <input          // patched in 03/30/25
                type="text"
                placeholder="Restaurant Name"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit">Sign Up</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
