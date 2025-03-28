import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Components/Dashboard';

test('renders welcome message and orders section', () => {
  render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );

  // 1. Welcome message
  expect(screen.getByText(/welcome, kevin/i)).toBeInTheDocument();

  // 2. Orders section title
  expect(screen.getByText(/current orders/i)).toBeInTheDocument();

  // 3. One of the orders (static content for now)
  expect(screen.getByText(/Jimmy Neutron/i)).toBeInTheDocument();
});
