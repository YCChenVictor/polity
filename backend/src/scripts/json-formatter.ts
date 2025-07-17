// find all json files: find src tests -type f -name "*.json"
// run it: yarn build; node dist/scripts/json-formatter.js src/your-file.json

import { execSync } from "child_process";
import { promises as fsPromises } from "fs";

const directories = ["src/"];

function findJsonFilesWithLinux(directory: string): string[] {
  try {
    // Run the find command and capture output
    const command = `find "${directory}" -type f -iname "*.json"`;
    const output = execSync(command, { encoding: "utf8" });

    // Split the output into an array, remove empty lines
    return output.split("\n").filter((line) => line.trim() !== "");
  } catch (error) {
    console.error(`Error executing find command for ${directory}:`, error);
    return [];
  }
}

const jsonFiles = directories.map(findJsonFilesWithLinux).flat();

(async () => {
  for (const json of jsonFiles) {
    try {
      let data = await fsPromises.readFile(json, "utf8");
      data = data.replace(/^\uFEFF/, "").replace(/[\u200B-\u200D\uFEFF]/g, "");
      const formattedJson = JSON.stringify(JSON.parse(data), null, 2);
      await fsPromises.writeFile(json, formattedJson);
    } catch (error) {
      console.error("Error formatting JSON:", error);
    }
  }
})();
