import { TextDecoder, TextEncoder } from 'node:util';

if (!(new TextEncoder().encode('') instanceof Uint8Array)) {
  globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;
  globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;
  globalThis.Uint8Array = Uint8Array;
}
