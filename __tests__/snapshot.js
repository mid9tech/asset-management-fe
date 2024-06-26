import { render } from '@testing-library/react';
import Index from '../src/app/page';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

it('renders homepage unchanged', () => {
  const { asFragment } = render(<Index />);
  expect(asFragment()).toMatchSnapshot();
});