import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateAcceptedDateColumn1709234121552
  implements MigrationInterface
{
  name = 'updateAcceptedDateColumn1709234121552';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rent" ALTER COLUMN "accepted_date" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rent" ALTER COLUMN "accepted_date" SET NOT NULL`,
    );
  }
}
