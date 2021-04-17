import {MigrationInterface, QueryRunner} from "typeorm";

export class migrations1618683857443 implements MigrationInterface {
    name = 'migrations1618683857443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `product` CHANGE `sell` `sell` decimal(12,2) NOT NULL DEFAULT '0'");
        await queryRunner.query("ALTER TABLE `product` CHANGE `promo` `promo` decimal(12,2) NOT NULL DEFAULT '0'");
        await queryRunner.query("ALTER TABLE `product` CHANGE `agent` `agent` decimal(12,2) NOT NULL DEFAULT '0'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `product` CHANGE `agent` `agent` decimal(12,2) NOT NULL DEFAULT '0.00'");
        await queryRunner.query("ALTER TABLE `product` CHANGE `promo` `promo` decimal(12,2) NOT NULL DEFAULT '0.00'");
        await queryRunner.query("ALTER TABLE `product` CHANGE `sell` `sell` decimal(12,2) NOT NULL DEFAULT '0.00'");
    }

}
