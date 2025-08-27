import app from "./app";
import "./env";

if (!process.env.IPFS_API) {
  throw new Error("Missing IPFS_API in environment");
}

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
