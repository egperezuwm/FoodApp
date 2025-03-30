// src/components/Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [restaurant, setRestaurant] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/register/', {
        name,
        email,
        restaurant,
        password,
      });
      alert('Account created successfully!');
      navigate('/login'); // Redirect to login after signup
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed! Please try again.');
    }
  };

  return (
    <div className="FormContainer">
      <div className="FormGroup">
        <div className="LoginPanel">
          <section className="FormPane">
            <h2>Create an Account</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" required />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
              <input type="text" value={restaurant} onChange={e => setRestaurant(e.target.value)} placeholder="Restaurant Name" required />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
              <button type="submit">Sign Up</button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Signup;
