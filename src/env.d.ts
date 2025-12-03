/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module '*.astro' {
  const Component: import('astro/runtime/server').AstroComponentFactory;
  export default Component;
}
