import express from "express";

import {
   createTransaction,
   deleteTransactionById,
   getAllTransactionByUserId,
   getSingleTransactionById,
   getUserTransactionSummaryByUserId,
} from "../controller/transactionController.js";

const transactionRouter = express.Router();

//  All Apies **
transactionRouter.post("", createTransaction);
transactionRouter.get("/user/:userId", getAllTransactionByUserId);
transactionRouter.get("/summary/:userId", getUserTransactionSummaryByUserId);
transactionRouter.get("/:id", getSingleTransactionById);
transactionRouter.delete("/:id", deleteTransactionById);

export default transactionRouter;
