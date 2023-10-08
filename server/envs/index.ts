import {config} from 'dotenv';
config();

export const {
  PORT,
  DATABASE_URL,
  SECRET_KEY
} = process.env;
