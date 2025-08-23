// Steps
// 1. Fetch all occupations from ESCO API and put them in tmp
// 2. Insert or update them in the database using Sequelize
// 3. Handle duplicates by ignoring them or updating existing records

// cd backend
// yarn build
// node src/scripts/import-occupations.ts

import fs from "fs/promises";

const occupations = await fs.readFile("../data/esco_occupations.json", "utf8");
console.log(JSON.parse(occupations));

//   const chunkSize = 1000;
//   for (let i = 0; i < rows.length; i += chunkSize) {
//     const chunk = rows.slice(i, i + chunkSize);
//     await Occupation.bulkCreate(chunk, {
//       ignoreDuplicates: true,
//       updateOnDuplicate: ["code", "title", "updatedAt"],
//     });
//     console.log(`Upserted ${Math.min(i + chunkSize, rows.length)}/${rows.length}`);
//   }

//   await sequelize.close();
//   console.log("Done.");
