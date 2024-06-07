import prisma from "../config/db";
import { withControllerHandler } from "../middlewares/controller.middleware";

export const getCategories = withControllerHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    select: { _count: true, id: true, name: true },
  });

  return res.status(200).json({
    status: true,
    message: "Successfully fetched.",
    data: { categories },
  });
});

export const deleteCategory = withControllerHandler(async (req, res) => {
  const { id } = req.params;

  const category = await prisma.category.delete({
    where: {
      id: Number(id),
    },
  });

  return res
    .status(200)
    .json({ status: true, message: "Category deleted.", data: { category } });
});

export const updateCategory = withControllerHandler(async (req, res) => {
  const { categoryName, categoryId } = req.body;

  if (!categoryName) {
    return res.status(400).json({
      status: false,
      message: "invalid category name.",
      data: {},
    });
  }

  const category = await prisma.category.update({
    where: { id: categoryId },
    data: { name: categoryName },
  });

  return res
    .status(200)
    .json({ status: true, message: "Category updated.", data: { category } });
});

export const addCategory = withControllerHandler(async (req, res) => {
  const { categoryName } = req.body;
  if (!categoryName) {
    return res.status(400).json({
      status: false,
      message: "invalid category name.",
      data: {},
    });
  }

  const category = await prisma.category.create({
    data: { name: categoryName },
  });

  return res.status(201).json({
    status: true,
    message: "Category successfully added.",
    data: { category },
  });
});
