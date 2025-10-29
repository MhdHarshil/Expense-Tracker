import xlsx from "xlsx";
import writeXLSX from "xlsx";
import Expense from "../models/Expense.js";


// Add Expense Source
export const addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body;

        // Validation: Check for missing fields
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "Please provide all required fields." });
        } 

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });

        await newExpense.save();
        res.status(201).json({ message: "Expense category added successfully.", expense: newExpense });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get All Expense Source
export const getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try  {
        const expense = await Expense.find({ userId }).sort({ date: -1});
        res.json({ expense }); 
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Delete Expense Source
export const deleteExpense = async (req, res) => {

    try {
        await Expense.findOneAndDelete(req.params.id);
        res.json({ message: "Expense category deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Download Excel of Expense Sources
export const downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        // Prepare data for Excel
        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = writeXLSX.utils.book_new();
        const ws = writeXLSX.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        xlsx.writeFile(wb, "ExpenseData.xlsx");
        res.download("ExpenseData.xlsx");
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};