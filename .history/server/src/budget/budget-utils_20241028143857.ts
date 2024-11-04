import { Response } from 'express';

// Function to get the budget
export function getBudget(res: Response, budget: number) {
    res.status(200).send({ "data": budget });
}

// Function to update the budget
export function updateBudget(res: Response, body: any, budget: { amount: number }) {
    // Validate the new budget amount exists and is a number
    if (!body.amount || typeof body.amount !== 'number') {
        return res.status(400).send({ error: "Invalid budget amount" });
    }

    // Update the budget
    budget.amount = body.amount;

    // Return the updated budget
    res.status(200).send({ "data": budget.amount });
}