/*
  Warnings:

  - You are about to drop the column `hrLink` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `userLink` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Ticket` DROP COLUMN `hrLink`,
    DROP COLUMN `userLink`;

-- CreateTable
CREATE TABLE `Image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `ticketId` INTEGER NOT NULL,
    `link` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Balance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `ticketId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `balance` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `preparedBy` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Balance_ticketId_key`(`ticketId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Ticket`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Balance` ADD CONSTRAINT `Balance_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Ticket`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
