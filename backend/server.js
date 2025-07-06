import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT;

async function initDB() {
   try {
      await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY, 
      user_id VARCHAR(255) NOT NULL, 
      title VARCHAR(255) NOT NULL, 
      amount DECIMAL(10,2) NOT NULL, 
      category VARCHAR(255) NOT NULL, 
      created_at DATE NOT NULL DEFAULT CURRENT_DATE      
      )`;
      console.log(`Database Initialized Successfully!!`);
   } catch (err) {
      console.log(`Error Initialized Successfully!`);
      process.exit(1);
   }
}

//  the root port:
app.get("/", (req, res) => {
   return res.json({
      message: `Server is running now!!`,
      success: true,
   });
});

initDB().then(() => {
   //  Listen the port
   app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
   });
});
