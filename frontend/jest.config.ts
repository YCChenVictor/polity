export default {
  detectOpenHandles: true,
  forceExit: true,
  preset: "ts-jest/presets/default-esm",
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: ["src/**/*.ts"],
};
