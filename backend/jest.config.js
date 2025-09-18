const config = {
  preset: "ts-jest",
  detectOpenHandles: true,
  forceExit: true,
  testEnvironment: "node",
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFiles: ["<rootDir>/tests/setupEnv.ts"],
  // setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  "modulePaths": [
    "<rootDir>"
  ],
  reporters: [["default", { summaryThreshold: 10 }]],
};

export default config;
