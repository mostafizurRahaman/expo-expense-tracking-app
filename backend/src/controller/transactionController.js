import { sql } from "../config/db.js";

export const createTransaction = async (req, res) => {
   try {
      const { title, amount, category, user_id } = req.body;

      if (!title || !amount || !category || !user_id) {
         return res.status(400).json({
            message: "All fields are required!!",
         });
      }
      console.log(req.body);
      const transaction = await sql`
         INSERT INTO transactions (user_id, title, amount, category)
         VALUES (${user_id}, ${title}, ${amount}, ${category})
         RETURNING *
         `;

      return res.status(201).json({
         success: true,
         message: `Transactions is created successfully!`,
         data: transaction[0],
      });
   } catch (err) {
      console.log("Error Creating the transaction", err);
      res.status(500).json({
         messaage: "Internal Server Error!",
      });
   }
};

export const getAllTransactionByUserId = async (req, res) => {
   const { userId } = req.params;

   try {
      const transactions =
         await sql`SELECT * FROM transactions WHERE user_id = ${userId}`;
      return res.status(200).json({
         success: true,
         message: `All transactions  found successfully!`,
         data: transactions,
      });
   } catch (err) {
      console.log("Error Getting the transaction", err);
      res.status(500).json({
         messaage: "Internal Server Error!",
      });
   }
};

export const getUserTransactionSummaryByUserId = async (req, res) => {
   const { userId } = req.params;

   try {
      const balance =
         await sql`SELECT coalesce(SUM(amount), 0) AS total FROM transactions WHERE user_id = ${userId}`;
      const income =
         await sql`SELECT coalesce(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND category = 'income'`;
      const expense =
         await sql`SELECT coalesce(SUM(amount), 0) AS expense FROM transactions WHERE user_id = ${userId} AND category = 'expense'`;

      return res.status(200).json({
         success: true,
         message: `All transactions  found successfully!`,
         data: {
            balance: balance?.[0]?.total,
            income: income?.[0]?.income,
            expense: expense?.[0]?.expense,
         },
      });
   } catch (err) {
      console.log("Error Getting the transaction", err);
      res.status(500).json({
         messaage: "Internal Server Error!",
      });
   }
};

export const getSingleTransactionById = async (req, res) => {
   const { id } = req.params;

   if (isNaN(parseInt(id))) {
      return res.status(404).json({
         success: false,
         message: `ID should be number!!!`,
         data: null,
      });
   }
   try {
      const transactions =
         await sql`SELECT * FROM transactions WHERE id = ${id} `;

      if (!transactions[0]) {
         return res.status(404).json({
            success: false,
            message: `No Transactions found with id ${id}!`,
            data: null,
         });
      }

      console.log(transactions);
      return res.status(200).json({
         success: true,
         message: `All transactions  found successfully!`,
         data: transactions[0],
      });
   } catch (err) {
      console.log("Error Getting the transaction", err);
      return res.status(500).json({
         messaage: "Internal Server Error!",
      });
   }
};

export const deleteTransactionById = async (req, res) => {
   const { id } = req.params;
   console.log({ id });

   if (isNaN(parseInt(id))) {
      return res.status(404).json({
         success: false,
         message: `ID should be number!!!`,
         data: null,
      });
   }

   try {
      const transactions = await sql`DELETE FROM transactions WHERE id = ${id} 
         RETURNING *`;
      console.log(transactions);

      if (!transactions[0]) {
         return res.status(404).json({
            success: false,
            message: `No Transactions found with id ${id}!`,
            data: null,
         });
      }

      console.log(transactions[0]);
      return res.status(200).json({
         success: true,
         message: `transaction id -${transactions?.[0]?.id} deleted successfully!`,
         data: transactions[0],
      });
   } catch (err) {
      console.log("Error deleting the transaction", err);
      return res.status(500).json({
         messaage: "Internal Server Error!",
      });
   }
};
