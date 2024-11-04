import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { fetchBudget } from "../../utils/budget-utils";

const Budget = () => {
  const { budget, setBudget } = useContext(AppContext);

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
  }, [setBudget]);  // Only include setBudget in dependencies

  return (
    <div className="alert alert-secondary">
      <span>Budget: ${budget}</span>
    </div>
  );
};

export default Budget;