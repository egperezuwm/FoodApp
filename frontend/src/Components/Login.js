import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed! Please check your credentials.');
    }
  };

  return (
    <div className="FormContainer">
      <div className="FormGroup">
        <div className="LoginPanel">
          <section className="FormPane">
            <div className="LogoArea">
              <div className='companyLogo'></div>
              <h2>FoodDeliveryApp</h2>
            </div>
            <form onSubmit={handleSubmit} id="LoginForm">
              <h2>Log into your account</h2>
              <p>Hey! It's nice to have you back.</p>
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
              <div className='loginLinks'>
                <section>
                  <input type="checkbox" name="remember_me" id="remember_me" />
                  <label htmlFor="remember_me">Remember me</label>
                </section>
                <a href="https://google.com">Forgot Password</a>
              </div>
              <button type="submit">Login</button>

              {/* ✅ Create Account Button */}
              <button 
                type="button" 
                onClick={() => navigate('/signup')} 
                style={{ marginTop: '10px', background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
              >
                Create an Account
              </button>
            </form>
          </section>
        </div>
        <div className='loginSideHeader'></div>
      </div>
    </div>
  );
};

export default Login;
