import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { v4 as uuidv4 } from 'uuid';
import { createExpense } from "../../utils/expense-utils";

const AddExpenseForm = () => {
  // Consume AppContext
  const { expenses, setExpenses } = useContext(AppContext);
  
  // State for form inputs
  const [description, setDescription] = useState<string>('');
  const [cost, setCost] = useState<string>('');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate cost is a number
    const costNumber = parseFloat(cost);
    if (isNaN(costNumber)) return;

    // Create new expense object
    const newExpense = {
      id: uuidv4(),
      description: description,
      cost: costNumber,
    };

    try {
      // First create the expense in the backend
      await createExpense(newExpense);
      
      // Then update the context
      setExpenses([...expenses, newExpense]);

      // Reset form
      setDescription('');
      setCost('');
    } catch (error) {
      console.error('Failed to create expense:', error);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="row">
        <div className="col-sm">
          <label htmlFor="description">Description</label>
          <input
            required
            type="text"
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="col-sm">
          <label htmlFor="cost">Cost</label>
          <input
            required
            type="number"
            className="form-control"
            id="cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </div>
        <div className="col-sm">
          <button type="submit" className="btn btn-primary mt-3">
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddExpenseForm;