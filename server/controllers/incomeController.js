import xlsx from "xlsx";
import writeXLSX from "xlsx";
import Income from "../models/Income.js";


// Add Income Source
export const addIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, source, amount, date } = req.body;

        // Validation: Check for missing fields
        if (!source || !amount || !date) {
            return res.status(400).json({ message: "Please provide all required fields." });
        } 

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });

        await newIncome.save();
        res.status(201).json({ message: "Income source added successfully.", income: newIncome });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get All Income Source
export const getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try  {
        const income = await Income.find({ userId }).sort({ date: -1});
        res.json({ income }); 
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Delete Income Source
export const deleteIncome = async (req, res) => {

    try {
        await Income.findOneAndDelete(req.params.id);
        res.json({ message: "Income source deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Download Excel of Income Sources
export const downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1 });

        // Prepare data for Excel
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = writeXLSX.utils.book_new();
        const ws = writeXLSX.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, "IncomeData.xlsx");
        res.download("IncomeData.xlsx");
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};