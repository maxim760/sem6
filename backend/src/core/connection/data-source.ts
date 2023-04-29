import { DataSource } from "typeorm";
import dotenv from "dotenv"
dotenv.config()
export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: ["./src/**/*.entity.ts"],
  subscribers: [],
  migrations: [],

  extra: {
    ssl: {
      "rejectUnauthorized": false
    }
  }
})