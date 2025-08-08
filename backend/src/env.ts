import path from "path";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: path.resolve(process.cwd(), "env.test") });
} else {
  dotenv.config({ path: path.resolve(process.cwd(), ".env") });
}
