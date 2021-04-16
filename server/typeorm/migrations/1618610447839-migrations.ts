import {MigrationInterface, QueryRunner} from "typeorm";

export class migrations1618610447839 implements MigrationInterface {
    name = 'migrations1618610447839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `country` (`id` varchar(36) NOT NULL, `country` varchar(225) NULL, `province` varchar(225) NULL, `city` varchar(225) NULL, `address` text NULL, `createAt` timestamp NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `accounts` ADD `locationId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `accounts` ADD UNIQUE INDEX `IDX_7bda73c73a959f34539273d02e` (`locationId`)");
        await queryRunner.query("ALTER TABLE `user` ADD `updateAt` timestamp NULL ON UPDATE CURRENT_TIMESTAMPS");
        await queryRunner.query("CREATE UNIQUE INDEX `REL_7bda73c73a959f34539273d02e` ON `accounts` (`locationId`)");
        await queryRunner.query("ALTER TABLE `accounts` ADD CONSTRAINT `FK_7bda73c73a959f34539273d02ee` FOREIGN KEY (`locationId`) REFERENCES `country`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `accounts` DROP FOREIGN KEY `FK_7bda73c73a959f34539273d02ee`");
        await queryRunner.query("DROP INDEX `REL_7bda73c73a959f34539273d02e` ON `accounts`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `updateAt`");
        await queryRunner.query("ALTER TABLE `accounts` DROP INDEX `IDX_7bda73c73a959f34539273d02e`");
        await queryRunner.query("ALTER TABLE `accounts` DROP COLUMN `locationId`");
        await queryRunner.query("DROP TABLE `country`");
    }

}
