import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { fetchBudget, updateBudget } from "../../utils/budget-utils";

const Budget = () => {
  const { budget, setBudget } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBudget, setEditedBudget] = useState(budget.toString());

  useEffect(() => {
    const loadBudget = async () => {
      try {
        const budgetAmount = await fetchBudget();
        setBudget(budgetAmount);
      } catch (error) {
        console.error('Failed to load budget:', error);
      }
    };

    loadBudget();
  }, [setBudget]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedBudget(budget.toString());
  };

  const handleSaveClick = async () => {
    const newBudget = parseFloat(editedBudget);
    if (isNaN(newBudget)) {
      alert('Please enter a valid number');
      return;
    }

    try {
      const updatedBudget = await updateBudget(newBudget);
      setBudget(updatedBudget);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update budget:', error);
      alert('Failed to update budget');
    }
  };

  return (
    <div className="alert alert-secondary" data-testid="budget-display">
      {!isEditing ? (
        <>
          <span>Budget: ${budget}</span>
          <button 
            className="btn btn-primary btn-sm ms-2"
            onClick={handleEditClick}
          >
            Edit Budget
          </button>
        </>
      ) : (
        <>
          <input
            type="number"
            className="form-control mb-2"
            value={editedBudget}
            onChange={(e) => setEditedBudget(e.target.value)}
            data-testid="budget-input"
          />
          <button 
            className="btn btn-success btn-sm"
            onClick={handleSaveClick}
          >
            Save Budget
          </button>
        </>
      )}
    </div>
  );
};

export default Budget;