// jest.setup.ts
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.TextDecoder = TextDecoder as any;
