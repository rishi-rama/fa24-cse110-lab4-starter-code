import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Expense } from "../../types/types";

const ExpenseItem = (currentExpense: Expense) => {
  const { expenses, setExpenses } = useContext(AppContext);

  const handleDeleteExpense = (currentExpense: Expense) => {
    // Filter out the expense to delete
    const updatedExpenses = expenses.filter(
      (expense) => expense.id !== currentExpense.id
    );
    setExpenses(updatedExpenses);
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div>{currentExpense.name}</div>
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