import type { config } from "./config.tsx";

declare module "@reactive-dot/core" {
  export interface Register {
    config: typeof config;
  }
}
