import {MigrationInterface, QueryRunner} from "typeorm";

export class migrations1618603428686 implements MigrationInterface {
    name = 'migrations1618603428686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` ADD `updateAt` timestamp NULL ON UPDATE CURRENT_TIMESTAMPS");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `updateAt`");
    }

}
