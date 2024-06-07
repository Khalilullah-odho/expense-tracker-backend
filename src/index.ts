import express from "express";
import prisma from "./config/db";
import "dotenv/config";
import userRouter from "./routes/user.routes";
import expenseRouter from "./routes/expense.routes";
import categoryRouter from "./routes/category.routes";

const app = express();
const PORT = 4000;

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/category", categoryRouter);

app.listen(PORT, () => {
  console.log(`Server Running on PORT:${PORT}`);
});
// Graceful shutdown on termination signals (optional)
process.on("SIGINT", () => {
  console.log("Received SIGINT, disconnecting from Prisma...");
  prisma
    .$disconnect()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error("Error disconnecting from Prisma:", e);
      process.exit(1);
    });
});
