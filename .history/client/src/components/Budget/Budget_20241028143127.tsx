import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { fetchBudget, updateBudget } from "../../utils/budget-utils";

const Budget = () => {
  const { budget, setBudget } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(budget.toString());

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
  }, [setBudget]);

  const handleEditClick = async () => {
    if (isEditing) {
      const budgetValue = parseFloat(newBudget);
      if (!isNaN(budgetValue) && budgetValue > 0) {
        try {
          // Update budget in backend first
          const updatedBudget = await updateBudget(budgetValue);
          // If successful, update local state
          setBudget(updatedBudget);
        } catch (error) {
          console.error('Failed to update budget:', error);
          // Revert to previous budget value
          setNewBudget(budget.toString());
        }
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="alert alert-secondary p-3 d-flex align-items-center justify-content-between">
      {isEditing ? (
        <input
          data-testid="budget-input"
          type="number"
          className="form-control"
          value={newBudget}
          onChange={(e) => setNewBudget(e.target.value)}
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