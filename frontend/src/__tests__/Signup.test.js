import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Signup from '../Components/Signup';
import axios from 'axios';

jest.mock('axios');
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

test('renders signup form and submits user input correctly', async () => {
  axios.post.mockResolvedValue({}); // Simulate successful signup

  render(
    <BrowserRouter>
      <Signup />
    </BrowserRouter>
  );

  // Fill in form fields
  fireEvent.change(screen.getByPlaceholderText(/full name/i), {
    target: { value: 'Kevin Santamaria' },
  });
  fireEvent.change(screen.getByPlaceholderText(/email/i), {
    target: { value: 'kevin@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText(/restaurant name/i), {
    target: { value: 'Kevin’s Kitchen' },
  });
  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { value: 'securepassword' },
  });

  // Submit form
  fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/api/register/',
      {
        name: 'Kevin Santamaria',
        email: 'kevin@example.com',
        restaurant: 'Kevin’s Kitchen',
        password: 'securepassword',
      }
    );
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/login');
  });
});
