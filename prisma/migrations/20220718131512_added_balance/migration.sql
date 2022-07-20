/*
  Warnings:

  - You are about to alter the column `balance` on the `Balance` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Added the required column `balanceDate` to the `Balance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Balance` ADD COLUMN `balanceDate` VARCHAR(191) NOT NULL,
    MODIFY `balance` INTEGER NOT NULL;
