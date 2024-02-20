import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserColumnExternalId1708440969057
  implements MigrationInterface
{
  name = 'addUserColumnExternalId1708440969057';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "external_id" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "external_id"`);
  }
}
