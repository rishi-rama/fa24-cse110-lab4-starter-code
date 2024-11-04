import { Expense } from "../types";
import { Request, Response } from "express";

export function createExpenseServer(req: Request, res: Response, expenses: Expense[]) {
    const { id, cost, description } = req.body;

    if (!description || !id || !cost) {
        return res.status(400).send({ error: "Missing required fields" });
    }

    const newExpense: Expense = {
        id: id,
        description,
        cost,
    };

    expenses.push(newExpense);
    res.status(201).send(newExpense);
}

export function deleteExpense(req: Request, res: Response, expenses: Expense[]) {
    const { id } = req.params;  // Get ID from URL parameter

    // Find the expense index
    const expenseIndex = expenses.findIndex((expense) => expense.id === id);

    // If expense not found
    if (expenseIndex === -1) {
        return res.status(404).send({ error: "Expense not found" });
    }

    // Remove the expense
    expenses.splice(expenseIndex, 1);
    
    // Return updated expenses list
    res.status(200).send({ "data": expenses });
}

export function getExpenses(req: Request, res: Response, expenses: Expense[]) {
    res.status(200).send({ "data": expenses });
}