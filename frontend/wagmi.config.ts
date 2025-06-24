// wagmi.codegen.ts (at root of react-app)
import { defineConfig } from "@wagmi/cli";
import { hardhat } from "@wagmi/cli/plugins";
import { react } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/generated.ts", // Output file in your React app
  plugins: [
    hardhat({
      project: "../smart-contracts", // path to your Hardhat project
      include: ["PolityGovernment.json"], // only generate this one
    }),
    react(), // generate hooks for React
  ],
});
