// import Income from '../models/Income.js';
// import Expense from '../models/Expense.js';
// import { isValidObjectId, Types } from 'mongoose';



// // Dashboard data controller
// export const getDashboardData = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const userObjectId = new Types.ObjectId(String(userId));

//         // Fetch total income & expenses
//         const totalIncome = await Income.aggregate([
//             { $match: { userId: userObjectId } },
//             { $group: { _id: null, total: { $sum: "$amount" } } }
//         ]);

//         console.log("totalIncome:", {totalIncome, userId: isValidObjectId(userId)});


//         const totalExpenses = await Expense.aggregate([
//             { $match: { userId: userObjectId } },
//             { $group: { _id: null, total: { $sum: "$amount" } } }
//         ]);

//         // Get income transactions in the last 60 days
//         const last60DaysIncomeTransactions = await Income.find({
//             user: userObjectId,
//             date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
//         }).sort({ date: -1 });

//         // Get total income in the last 60 days
//         const incomeLast60Days = last60DaysIncomeTransactions.reduce(
//             (sum, transaction) => sum + transaction.amount,
//             0
//         );

//         // Get expense transactions in the last 30 days
//         const last30DaysExpenseTransactions = await Expense.find({
//             user: userObjectId,
//             date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
//         }).sort({ date: -1 });

//         // Get total expenses in the last 30 days
//         const expensesLast30Days = last30DaysExpenseTransactions.reduce(
//             (sum, transaction) => sum + transaction.amount,
//             0
//         );


//         // Fetch last 5 transactions (income + expenses)
//         const lastTransactions = [
//             ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
//                 (txn) => ({ ...txn.toObject(), type: 'income' })
//             ),
//             ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
//                 (txn) => ({ ...txn.toObject(), type: 'expense' })
//             )
//         ]
//             .sort((a, b) => b.date - a.date) // Sort by date descending
//             .slice(0, 5);

//             // Final response
//             res.json({
//                 totalBalance: 
//                     (totalIncome[0]?.total || 0) - (totalExpenses[0]?.total || 0),
//                 totalIncome: totalIncome[0]?.total || 0,
//                 totalExpense: totalExpenses[0]?.total || 0,
//                 last30DaysExpenses: {
//                     total: expensesLast30Days,
//                     transactions: last30DaysExpenseTransactions,
//                 },
//                 last60DaysIncome: {
//                     total: incomeLast60Days,
//                     transactions: last60DaysIncomeTransactions,
//                 },
//                 recentTransactions: lastTransactions,
//             });
//     } catch (error) {
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };

import Income from '../models/Income.js';
import Expense from '../models/Expense.js';
import { Types } from 'mongoose';

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));

    // ✅ Total Income
    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // ✅ Total Expense
    const totalExpenses = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // ✅ Income transactions (last 60 days)
    const last60DaysIncomeTransactions = await Income.find({
      userId: userObjectId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const incomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    // ✅ Expense transactions (last 30 days)
    const last30DaysExpenseTransactions = await Expense.find({
      userId: userObjectId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const expensesLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    // ✅ Recent transactions (income + expense)
    const lastTransactions = [
      ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map((txn) => ({
        ...txn.toObject(),
        type: "income",
      })),
      ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map((txn) => ({
        ...txn.toObject(),
        type: "expense",
      })),
    ]
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);

    // ✅ Send all data back
    res.json({
      totalBalance: (totalIncome[0]?.total || 0) - (totalExpenses[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpenses[0]?.total || 0,
      last30DaysExpenses: {
        total: expensesLast30Days,
        transactions: last30DaysExpenseTransactions,
      },
      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      },
      recentTransactions: lastTransactions,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
