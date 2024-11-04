import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { v4 as uuidv4 } from 'uuid';

const AddExpenseForm = () => {
  // Consume AppContext
  const { expenses, setExpenses } = useContext(AppContext);
  
  // State for form inputs
  const [name, setName] = useState<string>('');
  const [cost, setCost] = useState<string>('');

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate cost is a number
    const costNumber = parseFloat(cost);
    if (isNaN(costNumber)) return;

    // Create new expense object
    const expense = {
      id: uuidv4(),
      name: name,
      cost: costNumber,
    };

    // Add new expense to context
    setExpenses([...expenses, expense]);

    // Reset form
    setName('');
    setCost('');
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="row">
        <div className="col-sm">
          <label htmlFor="name">Name</label>
          <input
            required
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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