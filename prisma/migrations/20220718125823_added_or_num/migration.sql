/*
  Warnings:

  - Added the required column `orNum` to the `Reimbursement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Reimbursement` ADD COLUMN `orNum` INTEGER NOT NULL;
