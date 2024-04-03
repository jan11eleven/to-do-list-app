-- DropForeignKey
ALTER TABLE `todos` DROP FOREIGN KEY `Todos_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Todos` ADD CONSTRAINT `Todos_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
