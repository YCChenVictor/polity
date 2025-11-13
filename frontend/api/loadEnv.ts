import { config } from "dotenv";

if (process.env.NODE_ENV === "dev") {
  config({ path: ".env.local" });
}
