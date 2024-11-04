// Budget.tsx

import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { fetchBudget, updateBudget } from "../../utils/budget-utils";

const Budget = () => {
  // Get budget and setBudget from context
  const { budget, setBudget } = useContext(AppContext);
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  // State for new budget value during editing
  const [newBudget, setNewBudget] = useState(budget.toString());

  // Load initial budget from backend
  useEffect(() => {
    const loadBudget = async () => {
      try {
        const budgetAmount = await fetchBudget();
        setBudget(budgetAmount);
        setNewBudget(budgetAmount.toString());
      } catch (error) {
        console.error('Failed to load budget:', error);
      }
    };

    loadBudget();
  }, []); // Only run on mount

  // Handle edit button click
  const handleEditClick = async () => {
    if (isEditing) {
      const budgetValue = parseFloat(newBudget);
      // Validate budget value
      if (!isNaN(budgetValue) && budgetValue > 0) {
        try {
          // Update budget in backend
          const updatedBudget = await updateBudget(budgetValue);
          // Update local state
          setBudget(updatedBudget);
        } catch (error) {
          console.error('Failed to update budget:', error);
          // Revert to current budget on error
          setNewBudget(budget.toString());
        }
      } else {
        // Invalid input - revert to current budget
        setNewBudget(budget.toString());
      }
    }
    // Toggle edit mode
    setIsEditing(!isEditing);
  };

  // Handle input change
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBudget(e.target.value);
  };

  return (
    <div className="alert alert-secondary p-3 d-flex align-items-center justify-content-between">
      {isEditing ? (
        <input
          data-testid="budget-input"
          type="number"
          className="form-control"
          value={newBudget}
          onChange={handleBudgetChange}
          min="0"
          step="0.01"
        />
      ) : (
        <div data-testid="budget-display">Budget: ${budget}</div>
      )}
      <button
        className={`btn btn-${isEditing ? 'success' : 'primary'} ms-2`}
        onClick={handleEditClick}
        aria-label={isEditing ? 'Save budget' : 'Edit budget'}
      >
        {isEditing ? 'Save' : 'Edit'}
      </button>
    </div>
  );
};

export default Budget;