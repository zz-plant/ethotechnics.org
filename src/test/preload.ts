/**
 * Bun test preload file
 *
 * Bun natively supports TextEncoder/TextDecoder, so minimal setup is needed.
 * This file exists for any future global test configuration needs.
 */

// Configure happy-dom for DOM testing if needed
import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { mock } from "bun:test";

// Register happy-dom globals for React component testing
GlobalRegistrator.register();

// Mock Astro virtual modules
await mock.module("astro:react:opts", () => ({
  default: {},
}));
