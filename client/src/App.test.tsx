import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MyBudgetTracker } from './views/MyBudgetTracker';
import { AppContext } from './context/AppContext';

// Mock data
const mockExpenses = [{ id: '1', description: 'Test Expense', cost: 100 }];
const mockSetExpenses = jest.fn();
const mockBudget = 1000;
const mockSetBudget = jest.fn();

describe('MyBudgetTracker Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders MyBudgetTracker component', () => {
    render(
      <AppContext.Provider value={{ expenses: mockExpenses, setExpenses: mockSetExpenses, budget: mockBudget, setBudget: mockSetBudget }}>
        <MyBudgetTracker />
      </AppContext.Provider>
    );

    const headerElement = screen.getByText(/My Budget Planner/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('adds a new expense and updates the totals correctly', async () => {
    render(
      <AppContext.Provider value={{ expenses: mockExpenses, setExpenses: mockSetExpenses, budget: mockBudget, setBudget: mockSetBudget }}>
        <MyBudgetTracker />
      </AppContext.Provider>
    );

    const expenseNameInput = screen.getByLabelText('Description');
    const expenseCostInput = screen.getByLabelText('Cost');
    const addExpenseButton = screen.getByRole('button', { name: /Save/i });

    await act(async () => {
      fireEvent.change(expenseNameInput, { target: { value: 'New Expense' } });
      fireEvent.change(expenseCostInput, { target: { value: '50' } });
      fireEvent.click(addExpenseButton);
    });

    await waitFor(() => {
      expect(mockSetExpenses).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ description: 'New Expense', cost: 50 })
        ])
      );
    });
  });

 
  test('edits the budget correctly', async () => {
    render(
      <AppContext.Provider value={{ expenses: mockExpenses, setExpenses: mockSetExpenses, budget: mockBudget, setBudget: mockSetBudget }}>
        <MyBudgetTracker />
      </AppContext.Provider>
    );

    const editButton = screen.getByRole('button', { name: /Edit Budget/i });

    await act(async () => {
      fireEvent.click(editButton);
    });

    const budgetInput = screen.getByTestId('budget-input');
    const saveButton = screen.getByRole('button', { name: /Save Budget/i });

    await act(async () => {
      fireEvent.change(budgetInput, { target: { value: '1500' } });
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(mockSetBudget).toHaveBeenCalledWith(1500);
    });
  });
});