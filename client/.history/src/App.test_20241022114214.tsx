import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Budget Tracker Application', () => {
  beforeEach(() => {
    render(<App />);
  });

  // Test 1: Adding an expense
  test('can add a new expense and updates totals correctly', async () => {
    // Get form inputs
    const nameInput = screen.getByLabelText(/name/i);
    const costInput = screen.getByLabelText(/cost/i);
    const submitButton = screen.getByRole('button', { name: /save/i, type: 'submit' });

    // Initial values
    expect(screen.getByText(/Budget: \$1000/i)).toBeInTheDocument();
    expect(screen.getByText(/Remaining: \$1000/i)).toBeInTheDocument();
    expect(screen.getByText(/Spent so far: \$0/i)).toBeInTheDocument();

    // Add new expense
    await userEvent.type(nameInput, 'Test Expense');
    await userEvent.type(costInput, '300');
    fireEvent.click(submitButton);

    // Verify expense appears in list
    expect(screen.getByText('Test Expense')).toBeInTheDocument();
    expect(screen.getByText('$300')).toBeInTheDocument();

    // Verify totals update correctly
    expect(screen.getByText(/Remaining: \$700/i)).toBeInTheDocument();
    expect(screen.getByText(/Spent so far: \$300/i)).toBeInTheDocument();
  });

  // Test 2: Deleting an expense
  test('can delete an expense and updates totals correctly', async () => {
    // First add an expense
    const nameInput = screen.getByLabelText(/name/i);
    const costInput = screen.getByLabelText(/cost/i);
    const submitButton = screen.getByRole('button', { name: /save/i, type: 'submit' });

    await userEvent.type(nameInput, 'Test Expense');
    await userEvent.type(costInput, '300');
    fireEvent.click(submitButton);

    // Verify expense was added
    expect(screen.getByText('Test Expense')).toBeInTheDocument();

    // Delete the expense
    const deleteButton = screen.getByRole('button', { name: /x/i });
    fireEvent.click(deleteButton);

    // Verify expense was removed
    expect(screen.queryByText('Test Expense')).not.toBeInTheDocument();

    // Verify totals update correctly
    expect(screen.getByText(/Remaining: \$1000/i)).toBeInTheDocument();
    expect(screen.getByText(/Spent so far: \$0/i)).toBeInTheDocument();
  });

  // Test 3: Budget Balance Alert
  test('shows alert when remaining balance falls below zero', async () => {
    // Add expense that exceeds budget
    const nameInput = screen.getByLabelText(/name/i);
    const costInput = screen.getByLabelText(/cost/i);
    const submitButton = screen.getByRole('button', { name: /save/i, type: 'submit' });

    await userEvent.type(nameInput, 'Large Expense');
    await userEvent.type(costInput, '1200');
    fireEvent.click(submitButton);

    // Verify alert appears
    expect(screen.getByText(/Warning: You have exceeded your budget!/i)).toBeInTheDocument();
    
    // Verify negative balance is shown
    expect(screen.getByText(/Remaining: \$-200/i)).toBeInTheDocument();
    expect(screen.getByText(/Remaining:/i).parentElement).toHaveClass('alert-danger');
  });

  // Test 4: Editing Budget
  test('can edit budget value', async () => {
    // Click edit button
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    // Find budget input and edit
    const budgetInput = screen.getByTestId('budget-input');
    await userEvent.clear(budgetInput);
    await userEvent.type(budgetInput, '2000');
    
    // Save new budget
    const saveBudgetButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveBudgetButton);

    // Verify budget was updated
    expect(screen.getByText(/Budget: \$2000/i)).toBeInTheDocument();
    expect(screen.getByText(/Remaining: \$2000/i)).toBeInTheDocument();
  });

  // Test 5: Complete Budget Equation
  test('verifies budget equation (Budget = Remaining + Total Expenditure)', async () => {
    // Edit budget to 2000
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    const budgetInput = screen.getByTestId('budget-input');
    await userEvent.clear(budgetInput);
    await userEvent.type(budgetInput, '2000');
    const saveBudgetButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveBudgetButton);

    // Add multiple expenses
    const nameInput = screen.getByLabelText(/name/i);
    const costInput = screen.getByLabelText(/cost/i);
    const submitButton = screen.getByRole('button', { name: /save/i, type: 'submit' });

    // Add first expense
    await userEvent.type(nameInput, 'Expense 1');
    await userEvent.type(costInput, '500');
    fireEvent.click(submitButton);

    // Add second expense
    await userEvent.type(nameInput, 'Expense 2');
    await userEvent.type(costInput, '700');
    fireEvent.click(submitButton);

    // Verify budget equation
    // Budget ($2000) = Remaining ($800) + Total Expenditure ($1200)
    expect(screen.getByText(/Budget: \$2000/i)).toBeInTheDocument();
    expect(screen.getByText(/Remaining: \$800/i)).toBeInTheDocument();
    expect(screen.getByText(/Spent so far: \$1200/i)).toBeInTheDocument();
  });
});