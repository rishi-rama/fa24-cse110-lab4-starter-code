import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";

const Budget = () => {
  const { budget, setBudget } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(budget.toString());

  const handleEditClick = () => {
    if (isEditing) {
      const budgetValue = parseFloat(newBudget);
      if (!isNaN(budgetValue) && budgetValue > 0) {
        setBudget(budgetValue);
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="alert alert-secondary p-3 d-flex align-items-center justify-content-between">
      {isEditing ? (
        <input
          type="number"
          className="form-control"
          value={newBudget}
          onChange={(e) => setNewBudget(e.target.value)}
        />
      ) : (
        <div>Budget: ${budget}</div>
      )}
      <button
        className={`btn btn-${isEditing ? 'success' : 'primary'} ms-2`}
        onClick={handleEditClick}
      >
        {isEditing ? 'Save' : 'Edit'}
      </button>
    </div>
  );
};

export default Budget;