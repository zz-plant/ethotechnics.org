/**
 * Bun test preload: registers happy-dom globals for React component tests
 * and mocks the Astro virtual modules those components import.
 */

import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { mock } from "bun:test";

GlobalRegistrator.register();

// Mock Astro virtual modules
await mock.module("astro:react:opts", () => ({
  default: {},
}));
