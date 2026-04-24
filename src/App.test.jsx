import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

// Mock the barrel index so neither Navbar nor Welcome pull in GSAP/Tailwind
vi.mock('#components', () => ({
  Navbar: () => <nav data-testid="navbar" />,
  Welcome: () => <section data-testid="welcome" />,
}));

import App from './App.jsx';

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    expect(() => render(<App />)).not.toThrow();
  });

  it('renders a <main> root element', () => {
    const { container } = render(<App />);
    expect(container.querySelector('main')).toBeInTheDocument();
  });

  it('renders the Navbar component inside <main>', () => {
    const { getByTestId, container } = render(<App />);
    const main = container.querySelector('main');
    expect(main).toContainElement(getByTestId('navbar'));
  });

  it('renders the Welcome component inside <main>', () => {
    const { getByTestId, container } = render(<App />);
    const main = container.querySelector('main');
    expect(main).toContainElement(getByTestId('welcome'));
  });

  it('renders Navbar before Welcome in document order', () => {
    const { getAllByTestId } = render(<App />);
    // getAllByTestId is unavailable for different ids; use container children order
    const { container } = render(<App />);
    const main = container.querySelector('main');
    const children = Array.from(main.children);
    const navbarIdx = children.findIndex((el) => el.tagName === 'NAV');
    const welcomeIdx = children.findIndex((el) => el.tagName === 'SECTION');
    expect(navbarIdx).toBeLessThan(welcomeIdx);
  });

  it('imports Navbar and Welcome from the barrel index (not direct paths)', async () => {
    // Verify the barrel mock is what's rendered — if the direct import were used
    // it would not match the mocked data-testid attributes
    const { getByTestId } = render(<App />);
    expect(getByTestId('navbar')).toBeInTheDocument();
    expect(getByTestId('welcome')).toBeInTheDocument();
  });
});