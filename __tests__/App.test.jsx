import { render } from "@testing-library/react";
import Index from "../src/app/page"; // Adjust the path as necessary
import * as nextNavigation from 'next/navigation';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('Index', () => {
  it('should call redirect with /login', () => {
    render(<Index />);
    expect(nextNavigation.redirect).toHaveBeenCalledWith('/login');
  });

  it('should render fallback content', () => {
    const { container, getByText } = render(<Index />);
    expect(nextNavigation.redirect).toHaveBeenCalledWith('/login');
    expect(getByText('404 Not Found')).toBeInTheDocument();
  });
});