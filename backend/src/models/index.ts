// Importing necessary modules
import { Sequelize } from "sequelize";

// Internal imports
// import logger from "../logger";
import "../env";

const initializeDatabase = (
  environment: string,
  name: string,
  user: string,
  password: string,
  host: string,
  port: string,
): Sequelize => {
  let sequelize;

  if (["prod", "staging"].includes(environment)) {
    sequelize = new Sequelize(name, user, password, {
    //   logging: (msg) => logger.info(msg),
      logging: (msg) => console.log(msg),
      host: host,
      port: parseInt(port),
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    });
  } else {
    sequelize = new Sequelize(name, user, password, {
    //   logging: (msg) => logger.info(msg),
      logging: (msg) => console.log(msg),
      host: host,
      port: parseInt(port),
      dialect: "postgres",
    });
  }

  return sequelize;
};

if (
  !process.env.NODE_ENV ||
  !process.env.DB_NAME ||
  !process.env.DB_USER ||
  !process.env.DB_PASS ||
  !process.env.DB_HOST ||
  !process.env.DB_PORT
) {
  throw new Error("database environment variables are not defined.");
}

const sequelize = initializeDatabase(
  process.env.NODE_ENV,
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  process.env.DB_HOST,
  process.env.DB_PORT,
);

export default sequelize;
export { initializeDatabase };
