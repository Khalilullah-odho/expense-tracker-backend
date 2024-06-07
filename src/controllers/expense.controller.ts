import { validationResult } from "express-validator";
import prisma from "../config/db";
import { withControllerHandler } from "../middlewares/controller.middleware";

export const getAllExpenses = withControllerHandler(async (req, res) => {
  const expenseId = req.params.id;

  if (expenseId) {
    const expense = await prisma.expense.findUniqueOrThrow({
      where: { id: Number(expenseId) },
      select: {
        category: { select: { id: true, name: true } },
        category_id: true,
        date: true,
        description: true,
        id: true,
        amount: true,
        title: true,
        remaining_credit: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      status: true,
      message: "successfully fetched data.",
      data: { expense },
    });
  } else {
    const reqQuery = req.query as any;
    const categoryId = reqQuery.categoryId as number;
    const q = reqQuery.q as string;

    const filters = {
      user_id: req.user?.id,
      category_id: categoryId ? Number(categoryId) : undefined,
      title: { contains: q },
    };

    const total_aggregate = await prisma.expense.aggregate({
      _sum: { amount: true },
      _count: true,
      where: filters,
    });

    const allExpenses = await prisma.expense.findMany({
      where: filters,
      select: {
        category: { select: { id: true, name: true } },
        category_id: true,
        date: true,
        description: true,
        id: true,
        amount: true,
        title: true,
        remaining_credit: true,
        createdAt: true,
      },

      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      status: true,
      message: "successfully fetched data.",
      data: {
        expenses: allExpenses,
        total_aggregate: {
          debit_amount: total_aggregate._sum.amount,
          count: total_aggregate._count,
        },
      },
    });
  }
});

export const addExpense = withControllerHandler(async (req, res) => {
  const validations = validationResult(req);

  if (!validations.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: validations.array()[0].msg,
      data: { errors: validations.array() },
    });
  }

  const { title, amount, categoryId, description, date } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: req.user?.id },
    select: { credit_balance: true },
  });

  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found.",
      data: {},
    });
  }

  if (Number(amount) > user.credit_balance) {
    return res.status(400).json({
      status: false,
      message: "credit limit exceed. Please increase your credit limit.",
      data: {},
    });
  }

  const newExpense = await prisma.expense.create({
    data: {
      amount,
      title,
      category_id: categoryId,
      date,
      user_id: req.user?.id as number,
      description,
      remaining_credit: user?.credit_balance - amount,
    },

    select: {
      amount: true,
      category_id: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      date: true,
      id: true,
      title: true,
      description: true,
      user_id: true,
      remaining_credit: true,
    },
  });

  const newCreditAmount = await prisma.user.update({
    where: { id: req.user?.id },
    data: { credit_balance: { decrement: amount } },
    select: {
      full_name: true,
      credit_balance: true,
      is_admin: true,
      id: true,
      email_address: true,
    },
  });

  return res.status(201).json({
    status: true,
    message: "new expense added.",
    data: {
      expense: newExpense,
      credit_amount: newCreditAmount.credit_balance,
    },
  });
});

export const updateExpense = withControllerHandler(async (req, res) => {
  const validations = validationResult(req);

  if (!validations.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: validations.array()[0].msg,
      data: { errors: validations.array() },
    });
  }

  const { title, amount, categoryId, description, date, id, previousAmount } =
    req.body;

  const user = await prisma.user.findUnique({
    where: { id: req.user?.id },
    select: { credit_balance: true },
  });

  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found.",
      data: {},
    });
  }

  const diffAmount = Number(amount) - Number(previousAmount);

  if (diffAmount > user.credit_balance) {
    return res.status(400).json({
      status: false,
      message: "credit limit exceed. Please increase your credit limit.",
      data: {},
    });
  }

  const newExpense = await prisma.expense.update({
    where: { user_id: req.user?.id, id },
    data: {
      title,
      amount,
      description,
      date,
      category_id: categoryId,
    },
    select: {
      amount: true,
      category_id: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      date: true,
      id: true,
      title: true,
      description: true,
      user_id: true,
      remaining_credit: true,
    },
  });

  const newCreditAmount = await prisma.user.update({
    where: { id: req.user?.id },
    data: {
      credit_balance:
        diffAmount >= 0
          ? { decrement: diffAmount }
          : { increment: Math.abs(diffAmount) },
    },
    select: {
      full_name: true,
      credit_balance: true,
      is_admin: true,
      id: true,
      email_address: true,
    },
  });

  return res.status(201).json({
    status: true,
    message: "expense updated.",
    data: {
      expense: newExpense,
      credit_amount: newCreditAmount.credit_balance,
    },
  });
});

export const deleteExpense = withControllerHandler(async (req, res) => {
  const { id } = req.params;

  const expense = await prisma.expense.delete({
    where: { id: Number(id), user_id: req.user?.id },
    select: {
      amount: true,
      id: true,
      category_id: true,
    },
  });

  const userCredit = await prisma.user.update({
    where: { id: req.user?.id },
    data: {
      credit_balance: {
        increment: expense.amount,
      },
    },
  });

  return res.status(200).json({
    status: true,
    message: "Deleted successfully.",
    data: { expense, credit_balance: userCredit.credit_balance },
  });
});
