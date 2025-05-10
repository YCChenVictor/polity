import { defineConfig } from "@wagmi/cli";
import { react, hardhat } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/generated.ts",
  plugins: [
    hardhat({
      include: [
        // the following patterns are included by default
        "*.json",
      ],
      project: "../smart-contracts",
    }),
    react(),
  ],
});
