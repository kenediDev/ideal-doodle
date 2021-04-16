import {MigrationInterface, QueryRunner} from "typeorm";

export class migrations1618602863113 implements MigrationInterface {
    name = 'migrations1618602863113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` ADD `updateAt` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMPS");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `updateAt`");
    }

}
