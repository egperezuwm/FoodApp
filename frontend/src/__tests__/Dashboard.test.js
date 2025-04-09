import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Components/Dashboard';
import axios from 'axios';

jest.mock('axios');

const mockData = {
  user: 'Kevin',
  pending_orders: 0,
  orders: [],
  drivers: [],
  customers: [],
};

test('renders dashboard content correctly with no active orders', async () => {
  axios.get.mockResolvedValue({ data: mockData });

  render(
    <BrowserRouter>
      <Dashboard onLogout={jest.fn()} />
    </BrowserRouter>
  );

  // Wait for user name to appear in heading
  await waitFor(() =>
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
  );

  // Stats section: Pending Orders
  expect(screen.getByText(/pending orders:\s*0/i)).toBeInTheDocument();

  // Orders section
  expect(screen.getByText(/current orders/i)).toBeInTheDocument();
  expect(screen.getByText(/no active orders/i)).toBeInTheDocument();

  // Map section presence (just check for Leaflet container)
  expect(document.querySelector('.leaflet-container')).toBeInTheDocument();
});
