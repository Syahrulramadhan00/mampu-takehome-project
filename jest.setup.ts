import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock Next.js navigation hooks globally
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock ResizeObserver (required for shadcn/ui components in Jest)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};