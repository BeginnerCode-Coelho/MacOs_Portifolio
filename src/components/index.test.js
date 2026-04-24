import { describe, it, expect, vi } from 'vitest';

// Mock underlying component modules to avoid pulling in GSAP and other deps
vi.mock('#components/Navbar', () => ({
  default: function MockNavbar() { return null; },
}));

vi.mock('#components/Welcome', () => ({
  default: function MockWelcome() { return null; },
}));

// Import the barrel after mocks are in place
import * as components from './index.js';

describe('src/components/index.js barrel exports', () => {
  it('exports a Navbar named export', () => {
    expect(components).toHaveProperty('Navbar');
  });

  it('exports a Welcome named export', () => {
    expect(components).toHaveProperty('Welcome');
  });

  it('Navbar export is a function (React component)', () => {
    expect(typeof components.Navbar).toBe('function');
  });

  it('Welcome export is a function (React component)', () => {
    expect(typeof components.Welcome).toBe('function');
  });

  it('exports exactly Navbar and Welcome (no unexpected extras)', () => {
    const keys = Object.keys(components);
    expect(keys).toContain('Navbar');
    expect(keys).toContain('Welcome');
    // Both named exports are present; no other exports beyond these two
    expect(keys.length).toBe(2);
  });

  it('Navbar and Welcome are distinct exports', () => {
    expect(components.Navbar).not.toBe(components.Welcome);
  });
});