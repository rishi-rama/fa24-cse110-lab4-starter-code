import { Request, Response } from "express";
import { Expense } from "../types";

export function deleteExpense(req: Request, res: Response, expenses: Expense[]) {
    const { id } = req.params;  // Get the ID from the URL parameters

    // Find the index of the expense to delete
    const expenseIndex = expenses.findIndex((expense) => expense.id === id);

    // If expense not found, return 404
    if (expenseIndex === -1) {
        return res.status(404).send({ error: "Expense not found" });
    }

    // Remove the expense from the array
    expenses.splice(expenseIndex, 1);

    // Return success status
    res.status(200).send({ message: "Expense deleted successfully" });
}