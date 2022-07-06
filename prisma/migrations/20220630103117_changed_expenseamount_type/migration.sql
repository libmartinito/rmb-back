/*
  Warnings:

  - You are about to alter the column `expenseAmount` on the `Reimbursement` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Reimbursement` MODIFY `expenseAmount` INTEGER NOT NULL;
