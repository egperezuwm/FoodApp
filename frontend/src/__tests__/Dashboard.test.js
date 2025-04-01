import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Components/Dashboard';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Test data
const mockData = {
  user: 'Kevin',
  total_revenue: 2000,
  pending_orders: 3,
  orders: [
    {
      id: 1,
      customerName: 'Jimmy Neutron',
      status: 'pending',
      platform: 'DoorDash',
      itemCount: 3,
      price: 29.99,
      eta: '10 min',
    },
  ],
  drivers: [],
  customers: [],
};

test('renders dashboard stats and order info correctly', async () => {
  axios.get.mockResolvedValue({ data: mockData });

  render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );

  // Wait for the dashboard to fully render
  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /kevin/i })).toBeInTheDocument();
  });

  // Stats section
  expect(
    screen.getAllByText((_, element) =>
      /Total\s+Delivery\s+Revenue:\s+\$2000/.test(element?.textContent)
    )[0]
  ).toBeInTheDocument();

  expect(
    screen.getAllByText((_, element) =>
      /Pending\s+Orders:\s*3/.test(element?.textContent)
    )[0]
  ).toBeInTheDocument();

  // Order section
  expect(
    screen.getAllByText((_, element) =>
      /DoorDash\s+for\s+Jimmy\s+Neutron/.test(element?.textContent)
    )[0]
  ).toBeInTheDocument();

  expect(
    screen.getAllByText((_, element) =>
      /3\s+items\s+-\s+\$29\.99/.test(element?.textContent)
    )[0]
  ).toBeInTheDocument();

  expect(
    screen.getAllByText((_, element) =>
      /ETA:\s+10\s+min/.test(element?.textContent)
    )[0]
  ).toBeInTheDocument();

});
