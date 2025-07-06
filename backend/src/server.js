import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import rateLimiter from "./middleware/rateLimiter.js";
import transactionRouter from "./router/transaction-router.js";
import { initDB } from "./config/db.js";

const app = express();

dotenv.config();

//  ** MIDDLEWARES
app.use(express.json());
app.use(cors());
app.use("*", rateLimiter);

//  ** ENV **
const PORT = process.env.PORT;

//  the root port:
app.get("/", (req, res) => {
   return res.json({
      message: `Server is running now!!`,
      success: true,
   });
});

app.use("/api/transactions", transactionRouter);
initDB().then(() => {
   //  Listen the port
   app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
   });
});
