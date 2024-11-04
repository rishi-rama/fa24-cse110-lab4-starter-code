export type Expense = {
	id: string;
	description: string;
	cost: number;
};
  
  export interface AppContextType {
    expenses: Expense[];
    setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
    budget: number;
    setBudget: React.Dispatch<React.SetStateAction<number>>;
  }