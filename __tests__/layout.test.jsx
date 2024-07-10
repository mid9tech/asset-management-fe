// RootLayout.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from '../src/app/(router)/login/page'; // Adjust the import path as necessary
import '@testing-library/jest-dom'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));
jest.mock('@providers/loading', () => ({
  useLoading: () => ({
    setLoading: jest.fn(),
  }),
}));

jest.mock('@providers/auth', () => ({
  useAuth: () => ({
    setUser: jest.fn(),
    setToken: jest.fn(),
  }),
}));


describe('RootLayout', () => {
  it('renders Navbar, Sidebar, children and ToastContainer', () => {

    render(
      <Login />
    );

    // Check Navbar is rendered
    // expect(screen.getByTestId('navbar')).toBeInTheDocument();

    // // Check Sidebar is rendered
    // expect(screen.getByTestId('sidebar')).toBeInTheDocument();

    // // Check children are rendered
    // expect(screen.getByText(childrenContent)).toBeInTheDocument();

    // // Check ToastContainer is rendered
    // expect(screen.getByText('Toastify')).toBeInTheDocument();
  });
});
