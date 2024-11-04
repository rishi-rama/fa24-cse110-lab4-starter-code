import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Expense } from "../../types/types";
import { deleteExpense } from "../../utils/expense-utils";

const ExpenseItem = (currentExpense: Expense) => {
  const { expenses, setExpenses } = useContext(AppContext);

  const handleDeleteExpense = async (currentExpense: Expense) => {
    try {
      // Call backend delete endpoint
      await deleteExpense(currentExpense.id);
      
      // Update local state after successful delete
      const updatedExpenses = expenses.filter(
        (expense) => expense.id !== currentExpense.id
      );
      setExpenses(updatedExpenses);
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div>{currentExpense.description}</div>
      <div>${currentExpense.cost}</div>
      <div>
        <button 
          className="btn btn-danger btn-sm"
          onClick={() => handleDeleteExpense(currentExpense)}
        >
          x
        </button>
      </div>
    </li>
  );
};

export default ExpenseItem;