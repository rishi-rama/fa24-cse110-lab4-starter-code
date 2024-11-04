import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Budget Tracker Application', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('can add a new expense and updates totals correctly', async () => {
    const nameInput = screen.getByLabelText(/name/i);
    const costInput = screen.getByLabelText(/cost/i);
    const submitButton = screen.getByRole('button', { name: /save/i, type: 'submit' });

    await userEvent.type(nameInput, 'Test Expense');
    await userEvent.type(costInput, '300');
    fireEvent.click(submitButton);

    expect(screen.getByText('Test Expense')).toBeInTheDocument();
    expect(screen.getByText('$300')).toBeInTheDocument();
    expect(screen.getByText(/Remaining: \$700/i)).toBeInTheDocument();
    expect(screen.getByText(/Spent so far: \$300/i)).toBeInTheDocument();
  });

  test('can delete an expense and updates totals correctly', async () => {
    const nameInput = screen.getByLabelText(/name/i);
    const costInput = screen.getByLabelText(/cost/i);
    const submitButton = screen.getByRole('button', { name: /save/i, type: 'submit' });

    await userEvent.type(nameInput, 'Test Expense');
    await userEvent.type(costInput, '300');
    fireEvent.click(submitButton);

    const deleteButton = screen.getByRole('button', { name: /x/i });
    fireEvent.click(deleteButton);

    expect(screen.queryByText('Test Expense')).not.toBeInTheDocument();
    expect(screen.getByText(/Remaining: \$1000/i)).toBeInTheDocument();
    expect(screen.getByText(/Spent so far: \$0/i)).toBeInTheDocument();
  });

  test('shows alert when remaining balance falls below zero', async () => {
    const nameInput = screen.getByLabelText(/name/i);
    const costInput = screen.getByLabelText(/cost/i);
    const submitButton = screen.getByRole('button', { name: /save/i, type: 'submit' });

    await userEvent.type(nameInput, 'Large Expense');
    await userEvent.type(costInput, '1200');
    fireEvent.click(submitButton);

    expect(screen.getByText(/Warning: You have exceeded your budget!/i)).toBeInTheDocument();
    expect(screen.getByText(/Remaining: \$-200/i)).toBeInTheDocument();
    expect(screen.getByText(/Remaining:/i).parentElement).toHaveClass('alert-danger');
  });

  test('can edit budget value', async () => {
    // First click edit
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    
    // Now find the input - we know it's in a div with Budget in it
    const budgetDiv = screen.getByText('Budget:').parentElement;
    const budgetInput = budgetDiv.querySelector('input');
    if (!budgetInput) throw new Error('Budget input not found');
    
    await userEvent.clear(budgetInput);
    await userEvent.type(budgetInput, '2000');
    
    const saveBudgetButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveBudgetButton);

    expect(screen.getByText(/Budget: \$2000/i)).toBeInTheDocument();
    expect(screen.getByText(/Remaining: \$2000/i)).toBeInTheDocument();
  });

  test('verifies budget equation (Budget = Remaining + Total Expenditure)', async () => {
    // First click edit
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    
    // Find budget input same way as above
    const budgetDiv = screen.getByText('Budget:').parentElement;
    const budgetInput = budgetDiv.querySelector('input');
    if (!budgetInput) throw new Error('Budget input not found');
    
    await userEvent.clear(budgetInput);
    await userEvent.type(budgetInput, '2000');
    
    const saveBudgetButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveBudgetButton);

    // Add multiple expenses
    const nameInput = screen.getByLabelText(/name/i);
    const costInput = screen.getByLabelText(/cost/i);
    const submitButton = screen.getByRole('button', { name: /save/i, type: 'submit' });

    // Add first expense
    await userEvent.clear(nameInput);
    await userEvent.clear(costInput);
    await userEvent.type(nameInput, 'Expense 1');
    await userEvent.type(costInput, '500');
    fireEvent.click(submitButton);

    // Add second expense
    await userEvent.clear(nameInput);
    await userEvent.clear(costInput);
    await userEvent.type(nameInput, 'Expense 2');
    await userEvent.type(costInput, '700');
    fireEvent.click(submitButton);

    expect(screen.getByText(/Budget: \$2000/i)).toBeInTheDocument();
    expect(screen.getByText(/Remaining: \$800/i)).toBeInTheDocument();
    expect(screen.getByText(/Spent so far: \$1200/i)).toBeInTheDocument();
  });
});