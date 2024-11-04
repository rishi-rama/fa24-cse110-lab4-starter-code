import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";

const Remaining = () => {
  const { expenses, budget } = useContext(AppContext);
  const [alertVisible, setAlertVisible] = useState(false);

  // Calculate total expenses
  const totalExpenses = expenses.reduce((total, item) => {
    return total + item.cost;
  }, 0);

  // Calculate remaining budget
  const remaining = budget - totalExpenses;

  // Determine alert type based on remaining amount
  const alertType = remaining < 0 ? "alert-danger" : "alert-success";

  // Show alert when remaining goes below 0
  useEffect(() => {
    if (remaining < 0) {
      setAlertVisible(true);
      const timer = setTimeout(() => setAlertVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [remaining]);

  return (
    <>
      <div className={`alert ${alertType}`}>
        <span>Remaining: ${remaining}</span>
      </div>
      {alertVisible && (
        <div className="alert alert-warning" role="alert">
          Warning: You have exceeded your budget!
        </div>
      )}
    </>
  );
};

export default Remaining;