import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';

// ---------------------------------------------------------------------------
// Module mocks (hoisted before imports)
// ---------------------------------------------------------------------------

vi.mock('gsap', () => ({
  default: {
    to: vi.fn(() => ({ kill: vi.fn() })),
  },
}));

// Store the useGSAP callback so tests can call it manually after render
// (refs are null during the render phase; only set after commit)
let capturedGsapCallback = null;

vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn((cb) => {
    // Capture the callback; tests call it manually with act() after render
    capturedGsapCallback = cb;
  }),
}));

import gsap from 'gsap';
import Welcome from './Welcome.jsx';

// ---------------------------------------------------------------------------
// Helper: render + invoke the GSAP setup callback manually after commit
// ---------------------------------------------------------------------------
function renderWelcome() {
  capturedGsapCallback = null;
  const result = render(<Welcome />);
  // At this point refs are attached; invoke the captured callback
  let cleanup;
  act(() => {
    if (capturedGsapCallback) {
      cleanup = capturedGsapCallback();
    }
  });
  return { ...result, cleanup };
}

// ---------------------------------------------------------------------------
// Welcome component — structural rendering
// ---------------------------------------------------------------------------

describe('Welcome component — structure', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a <section> with id="welcome"', () => {
    render(<Welcome />);
    expect(document.querySelector('section#welcome')).toBeInTheDocument();
  });

  it('renders the subtitle paragraph inside the section', () => {
    render(<Welcome />);
    const subtitle = document.querySelector('section#welcome p');
    expect(subtitle).toBeInTheDocument();
  });

  it('renders an h1 title inside the section', () => {
    render(<Welcome />);
    expect(document.querySelector('section#welcome h1')).toBeInTheDocument();
  });

  it('renders the small-screen notice div', () => {
    render(<Welcome />);
    expect(document.querySelector('.small-screen')).toBeInTheDocument();
  });

  it('small-screen div contains desktop-related notice text', () => {
    render(<Welcome />);
    const notice = document.querySelector('.small-screen p');
    expect(notice.textContent.toLowerCase()).toContain('desktop');
  });
});

// ---------------------------------------------------------------------------
// renderText — tested via DOM inspection
// ---------------------------------------------------------------------------

describe('renderText (via Welcome render)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders one <span> per character in the subtitle text', () => {
    render(<Welcome />);
    const subtitle = document.querySelector('section#welcome p');
    const subtitleText = "Hey I'm Andre! Welcome to my";
    expect(subtitle.querySelectorAll('span')).toHaveLength(subtitleText.length);
  });

  it('renders one <span> per character in the title text', () => {
    render(<Welcome />);
    const h1 = document.querySelector('section#welcome h1');
    const titleText = 'portifolio';
    expect(h1.querySelectorAll('span')).toHaveLength(titleText.length);
  });

  it('applies the subtitle className to every subtitle span', () => {
    render(<Welcome />);
    const spans = document.querySelectorAll('section#welcome p span');
    expect(spans.length).toBeGreaterThan(0);
    spans.forEach((span) => {
      expect(span.classList.contains('text-3xl')).toBe(true);
      expect(span.classList.contains('font-georama')).toBe(true);
    });
  });

  it('applies the title className to every title span', () => {
    render(<Welcome />);
    const spans = document.querySelectorAll('section#welcome h1 span');
    expect(spans.length).toBeGreaterThan(0);
    spans.forEach((span) => {
      expect(span.classList.contains('text-9xl')).toBe(true);
      expect(span.classList.contains('font-georama')).toBe(true);
    });
  });

  it('includes font-variation-settings in the server-rendered subtitle HTML', () => {
    // renderToStaticMarkup outputs the actual style attribute including all props
    const html = renderToStaticMarkup(<Welcome />);
    // Subtitle spans should carry fontVariationSettings (rendered as font-variation-settings)
    expect(html).toMatch(/font-variation-settings/);
  });

  it('includes font-variation-settings in the server-rendered title HTML', () => {
    const html = renderToStaticMarkup(<Welcome />);
    expect(html).toMatch(/font-variation-settings/);
  });

  it('renders non-space characters verbatim in title spans', () => {
    render(<Welcome />);
    const h1 = document.querySelector('section#welcome h1');
    const spans = h1.querySelectorAll('span');
    const titleText = 'portifolio';
    [...titleText].forEach((ch, i) => {
      expect(spans[i].textContent).toBe(ch);
    });
  });

  it('renders non-space characters verbatim in subtitle spans', () => {
    render(<Welcome />);
    const subtitle = document.querySelector('section#welcome p');
    const spans = subtitle.querySelectorAll('span');
    const subtitleText = "Hey I'm Andre! Welcome to my";
    // Only check non-space characters; spaces are rendered as-is (not nbsp)
    [...subtitleText].forEach((ch, i) => {
      if (ch !== ' ') {
        expect(spans[i].textContent).toBe(ch);
      }
    });
  });

  it('space characters in text are NOT replaced (condition is empty-string guard)', () => {
    // The source code checks `char === ''`, which never matches a real space.
    // Spaces therefore render as literal space characters.
    render(<Welcome />);
    const subtitle = document.querySelector('section#welcome p');
    const spans = subtitle.querySelectorAll('span');
    const subtitleText = "Hey I'm Andre! Welcome to my";
    [...subtitleText].forEach((ch, i) => {
      if (ch === ' ') {
        // Spaces are rendered as-is (no nbsp substitution occurs)
        expect(spans[i].textContent).toBe(' ');
      }
    });
  });
});

// ---------------------------------------------------------------------------
// setupTextHover — mouse event behaviour
// ---------------------------------------------------------------------------

describe('setupTextHover (via Welcome render)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not call gsap.to before any mouse events', () => {
    renderWelcome();
    expect(gsap.to).not.toHaveBeenCalled();
  });

  it('calls gsap.to for every subtitle span on mousemove', () => {
    renderWelcome();
    const subtitleEl = document.querySelector('section#welcome p');

    fireEvent.mouseMove(subtitleEl, { clientX: 50 });

    const subtitleText = "Hey I'm Andre! Welcome to my";
    expect(gsap.to).toHaveBeenCalledTimes(subtitleText.length);
  });

  it('calls gsap.to for every subtitle span on mouseleave', () => {
    renderWelcome();
    const subtitleEl = document.querySelector('section#welcome p');

    fireEvent.mouseLeave(subtitleEl);

    const subtitleText = "Hey I'm Andre! Welcome to my";
    expect(gsap.to).toHaveBeenCalledTimes(subtitleText.length);
  });

  it('calls gsap.to for every title span on mousemove', () => {
    renderWelcome();
    const h1 = document.querySelector('section#welcome h1');

    fireEvent.mouseMove(h1, { clientX: 100 });

    const titleText = 'portifolio';
    expect(gsap.to).toHaveBeenCalledTimes(titleText.length);
  });

  it('calls gsap.to for every title span on mouseleave', () => {
    renderWelcome();
    const h1 = document.querySelector('section#welcome h1');

    fireEvent.mouseLeave(h1);

    const titleText = 'portifolio';
    expect(gsap.to).toHaveBeenCalledTimes(titleText.length);
  });

  it('uses ease "power2.out" for all mousemove animations', () => {
    renderWelcome();
    const h1 = document.querySelector('section#welcome h1');

    fireEvent.mouseMove(h1, { clientX: 0 });

    vi.mocked(gsap.to).mock.calls.forEach((args) => {
      expect(args[1].ease).toBe('power2.out');
    });
  });

  it('passes fontVariationSettings to gsap.to on mousemove', () => {
    renderWelcome();
    const h1 = document.querySelector('section#welcome h1');

    fireEvent.mouseMove(h1, { clientX: 0 });

    vi.mocked(gsap.to).mock.calls.forEach((args) => {
      expect(typeof args[1].fontVariationSettings).toBe('string');
    });
  });

  it('passes fontVariationSettings to gsap.to on mouseleave', () => {
    renderWelcome();
    const h1 = document.querySelector('section#welcome h1');

    fireEvent.mouseLeave(h1);

    vi.mocked(gsap.to).mock.calls.forEach((args) => {
      expect(typeof args[1].fontVariationSettings).toBe('string');
    });
  });
});

// ---------------------------------------------------------------------------
// setupTextHover — weight / duration boundary values
// ---------------------------------------------------------------------------

describe('FONT_WEIGHTs boundary values', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('title mouseleave animates with weight 400 (title default)', () => {
    renderWelcome();
    const h1 = document.querySelector('section#welcome h1');
    fireEvent.mouseLeave(h1);

    const calls = vi.mocked(gsap.to).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    calls.forEach((args) => {
      expect(args[1].fontVariationSettings).toMatch(/400/);
    });
  });

  it('subtitle mouseleave animates with weight 100 (subtitle default)', () => {
    renderWelcome();
    const p = document.querySelector('section#welcome p');
    fireEvent.mouseLeave(p);

    const calls = vi.mocked(gsap.to).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    calls.forEach((args) => {
      expect(args[1].fontVariationSettings).toMatch(/100/);
    });
  });

  it('mouseleave uses duration 0.3 for title spans', () => {
    renderWelcome();
    const h1 = document.querySelector('section#welcome h1');
    fireEvent.mouseLeave(h1);

    const calls = vi.mocked(gsap.to).mock.calls;
    calls.forEach((args) => {
      expect(args[1].duration).toBeCloseTo(0.3);
    });
  });

  it('mousemove uses duration 0.25 for title spans', () => {
    renderWelcome();
    const h1 = document.querySelector('section#welcome h1');
    fireEvent.mouseMove(h1, { clientX: 0 });

    const calls = vi.mocked(gsap.to).mock.calls;
    calls.forEach((args) => {
      expect(args[1].duration).toBeCloseTo(0.25);
    });
  });

  it('mousemove uses duration 0.25 for subtitle spans', () => {
    renderWelcome();
    const p = document.querySelector('section#welcome p');
    fireEvent.mouseMove(p, { clientX: 0 });

    const calls = vi.mocked(gsap.to).mock.calls;
    calls.forEach((args) => {
      expect(args[1].duration).toBeCloseTo(0.25);
    });
  });
});

// ---------------------------------------------------------------------------
// setupTextHover — null container guard
// ---------------------------------------------------------------------------

describe('setupTextHover null-container guard', () => {
  it('does not throw when refs are null (no GSAP callback fired)', () => {
    // useGSAP mock is a no-op by default; component should mount safely
    vi.clearAllMocks();
    capturedGsapCallback = null;
    expect(() => render(<Welcome />)).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// setupTextHover — cleanup / event listener removal
// ---------------------------------------------------------------------------

describe('setupTextHover cleanup', () => {
  it('removes mousemove and mouseleave listeners on cleanup', () => {
    const addSpy = vi.spyOn(EventTarget.prototype, 'addEventListener');
    const removeSpy = vi.spyOn(EventTarget.prototype, 'removeEventListener');

    const { cleanup } = renderWelcome();

    // subtitle p + title h1 each get 2 listeners → at least 4 total
    const addCount = addSpy.mock.calls.filter(
      (c) => c[0] === 'mousemove' || c[0] === 'mouseleave'
    ).length;
    expect(addCount).toBeGreaterThanOrEqual(4);

    // Trigger the cleanup returned by setupTextHover (via useGSAP callback)
    if (cleanup) act(() => cleanup());

    const removeCount = removeSpy.mock.calls.filter(
      (c) => c[0] === 'mousemove' || c[0] === 'mouseleave'
    ).length;
    expect(removeCount).toBeGreaterThanOrEqual(4);

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('does not fire gsap.to after cleanup when mouse events fire', () => {
    const { cleanup } = renderWelcome();
    const h1 = document.querySelector('section#welcome h1');

    if (cleanup) act(() => cleanup());
    vi.clearAllMocks();

    fireEvent.mouseMove(h1, { clientX: 50 });
    fireEvent.mouseLeave(h1);

    // After cleanup, handlers are removed; gsap.to should not be called
    expect(gsap.to).not.toHaveBeenCalled();
  });
});