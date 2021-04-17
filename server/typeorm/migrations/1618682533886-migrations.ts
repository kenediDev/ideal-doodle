import {MigrationInterface, QueryRunner} from "typeorm";

export class migrations1618682533886 implements MigrationInterface {
    name = 'migrations1618682533886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `product` (`id` varchar(36) NOT NULL, `name` varchar(225) NOT NULL, `photo` varchar(225) NOT NULL, `sell` decimal(12,2) NOT NULL DEFAULT '0', `promo` decimal(12,2) NOT NULL DEFAULT '0', `agent` decimal(12,2) NOT NULL DEFAULT '0', `description` text NOT NULL, `status` tinyint NOT NULL DEFAULT '1', `createAt` timestamp NOT NULL, `updateAt` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP, `categoryId` varchar(36) NULL, `authorId` varchar(36) NULL, UNIQUE INDEX `IDX_22cc43e9a74d7498546e9a63e7` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `product` ADD CONSTRAINT `FK_ff0c0301a95e517153df97f6812` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `product` ADD CONSTRAINT `FK_dddbf2ae70d3f6312a02458837a` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `product` DROP FOREIGN KEY `FK_dddbf2ae70d3f6312a02458837a`");
        await queryRunner.query("ALTER TABLE `product` DROP FOREIGN KEY `FK_ff0c0301a95e517153df97f6812`");
        await queryRunner.query("DROP INDEX `IDX_22cc43e9a74d7498546e9a63e7` ON `product`");
        await queryRunner.query("DROP TABLE `product`");
    }

}
