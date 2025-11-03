import React, { useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import { useEffect } from 'react';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import Modal from "../../components/Modal"
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
      show: false,
      data: null,
    });
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

     // Get all expense Details
  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);

    // try {
    //   const response = await axiosInstance.get (
    //     `${API_PATHS.INCOME.GET_ALL_INCOME}`
    //   );

    //   if (response.data) {
    //     setIncomeData(response.data);
    //   } 
    // } catch (error) {
    //   console.log("Something went wrong. Please try again.", error)
    // } finally {
    //   setLoading(false);
    // }


    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      console.log("🟢 Expense API response:", response.data);

      // Handle based on structure
      const expenseArray = Array.isArray(response.data)
        ? response.data
        : response.data.expense || [];

      setExpenseData(expenseArray);
    } catch (error) {
      console.error("❌ Error fetching expense details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    // Validation Checks
    if (!category.trim()) {
      toast.error("Category is required.");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }

    if (!date) {
      toast.error("Date is required.");
      return;
    }


    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon
      });
      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error adding expense:",
        error.response?.data?.message || error.message
      );
    }
  };

    // Delete Expense
  const deleteExpense = async (id) => {
    // try {
    //   // await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

    //   // setOpenDeleteAlert({ show: false, data: null })
    //   // toast.success("Income details deteled successfully");
    //   // fetchIncomeDetails();

    //   await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

    //   toast.success("Expense details deleted successfully!");

    //   // Immediately update local state (UI updates instantly)
    //   setExpenseData((prev) => prev.filter((item) => item._id !== id));

    //   // Then close modal and re-fetch fresh data (optional)
    //   setOpenDeleteAlert({ show: false, data: null });
    //   setTimeout(fetchExpenseDetails, 500);

    // } catch (error) {
    //   console.error(
    //     "Error deleting expense:",
    //     error.response?.data?.message || error.message
    //   );
    // }




     try {
    const response = await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

    if (response.data?.message) {
      toast.success(response.data.message);
    } else {
      toast.success("Expense deleted successfully!");
    }

    // Instantly remove from UI
    setExpenseData((prev) => prev.filter((item) => item._id === id ? false : true));

    // Close delete modal
    setOpenDeleteAlert({ show: false, data: null });

  } catch (error) {
    console.error("❌ Error deleting expense:", error);
    toast.error("Failed to delete expense. Please try again.");
  }
  };

  // handle download expense details
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPESE,
        {
          responseType: "blob",
        }
      );

      // Create a URL for the bolb
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_detail.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error("Failed to download expense details. Please try again.")
    }
   };



    useEffect(() => {
      fetchExpenseDetails()
  
      return () => { };
    }, []);




  return (
    <DashboardLayout activeMenu="Expense">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

        <Modal 
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>


        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense detail?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Expense
