/*
  Warnings:

  - Added the required column `category_id` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Expense` ADD COLUMN `category_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `LookupCategories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `LookupCategories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
