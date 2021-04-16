import {MigrationInterface, QueryRunner} from "typeorm";

export class migrations1618575374592 implements MigrationInterface {
    name = 'migrations1618575374592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `accounts` (`id` varchar(36) NOT NULL, `avatar` varchar(225) NULL, `first_name` varchar(225) NULL, `last_name` varchar(225) NULL, `updateAt` timestamp NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `user` ADD `accountsId` varchar(36) NULL");
        await queryRunner.query("ALTER TABLE `user` ADD UNIQUE INDEX `IDX_c6db777a4be2277bbee8cc546f` (`accountsId`)");
        await queryRunner.query("CREATE UNIQUE INDEX `REL_c6db777a4be2277bbee8cc546f` ON `user` (`accountsId`)");
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `FK_c6db777a4be2277bbee8cc546ff` FOREIGN KEY (`accountsId`) REFERENCES `accounts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_c6db777a4be2277bbee8cc546ff`");
        await queryRunner.query("DROP INDEX `REL_c6db777a4be2277bbee8cc546f` ON `user`");
        await queryRunner.query("ALTER TABLE `user` DROP INDEX `IDX_c6db777a4be2277bbee8cc546f`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `accountsId`");
        await queryRunner.query("DROP TABLE `accounts`");
    }

}
