/*
  Warnings:

  - Added the required column `remaining_credit` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Expense` ADD COLUMN `remaining_credit` DOUBLE NOT NULL;
