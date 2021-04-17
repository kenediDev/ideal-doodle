import {MigrationInterface, QueryRunner} from "typeorm";

export class migrations1618659318762 implements MigrationInterface {
    name = 'migrations1618659318762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `category` (`id` varchar(36) NOT NULL, `name` varchar(225) NULL, `avatar` varchar(255) NULL, `createAt` timestamp NOT NULL, `updateAt` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP, `authorId` varchar(36) NULL, UNIQUE INDEX `IDX_23c05c292c439d77b0de816b50` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `category` ADD CONSTRAINT `FK_b72ffab954b3129f87176f41fb9` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `category` DROP FOREIGN KEY `FK_b72ffab954b3129f87176f41fb9`");
        await queryRunner.query("DROP INDEX `IDX_23c05c292c439d77b0de816b50` ON `category`");
        await queryRunner.query("DROP TABLE `category`");
    }

}
