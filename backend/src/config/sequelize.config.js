import dotenv from 'dotenv';
import path from 'path';

let config;

if(process.env.NODE_ENV === 'test') {
  dotenv.config({ path: path.resolve(process.cwd(), "env.test") });
} else {
  dotenv.config({ path: path.resolve(process.cwd(), ".env") });
}

if(['prod', 'staging'].includes(process.env.NODE_ENV)) {
  config = {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    dialectOptions: {
      ssl: {
          require: true,
          rejectUnauthorized: false,
        }
      }
  };
} else {
  config = {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
  };
}

export default config;
