import { createContext, useState } from "react";
import { AppContextType, Expense } from "../types/types";

// Initialize with default values
const initialState: AppContextType = {
  expenses: [],
  setExpenses: () => {},
  budget: 1000, // Default budget value
  setBudget: () => {},
};

export const AppContext = createContext<AppContextType>(initialState);

export const AppProvider = (props: any) => {
  const [expenses, setExpenses] = useState<Expense[]>(initialState.expenses);
  const [budget, setBudget] = useState<number>(initialState.budget);

  return (
    <AppContext.Provider
      value={{
        expenses,
        setExpenses,
        budget,
        setBudget,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};