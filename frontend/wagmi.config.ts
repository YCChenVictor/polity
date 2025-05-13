import { defineConfig } from "@wagmi/cli";
import { react, hardhat } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/generated.ts",
  plugins: [
    hardhat({
      project: "../smart-contracts",
      include: ["Upgradeable1.json"], // Only do this one first
    }),
    react(),
  ],
});
