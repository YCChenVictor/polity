// jest.setup.ts
import {
  TextEncoder as UtilTextEncoder,
  TextDecoder as UtilTextDecoder,
} from "util";

(
  globalThis as unknown as { TextEncoder: typeof globalThis.TextEncoder }
).TextEncoder = UtilTextEncoder as unknown as typeof globalThis.TextEncoder;

(
  globalThis as unknown as { TextDecoder: typeof globalThis.TextDecoder }
).TextDecoder = UtilTextDecoder as unknown as typeof globalThis.TextDecoder;
