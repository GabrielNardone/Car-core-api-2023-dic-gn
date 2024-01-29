import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1706556805004 implements MigrationInterface {
  name = 'init1706556805004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "car" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "brand" character varying NOT NULL, "model" character varying NOT NULL, "color" character varying NOT NULL, "passengers" integer NOT NULL, "ac" boolean NOT NULL, "price_per_day" integer NOT NULL, CONSTRAINT "PK_55bbdeb14e0b1d7ab417d11ee6d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "document" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "url" character varying NOT NULL, "src" character varying NOT NULL, "description" character varying NOT NULL, "title" character varying NOT NULL, "fk_user_id" integer NOT NULL, CONSTRAINT "PK_e57d3357f83f3cdc0acffc3d777" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."picture_type_enum" AS ENUM('front', 'back', 'side', 'other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "picture" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "src" character varying NOT NULL, "description" character varying NOT NULL, "title" character varying NOT NULL, "type" "public"."picture_type_enum" NOT NULL DEFAULT 'front', "date" date NOT NULL, "fk_car_id" integer, CONSTRAINT "PK_31ccf37c74bae202e771c0c2a38" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rent" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "accepted_date" date NOT NULL, "price_per_day" integer NOT NULL, "starting_date" date NOT NULL, "due_date" date NOT NULL, "end_date" date NOT NULL, "rejected" boolean NOT NULL, "fk_car_id" integer NOT NULL, "fk_user_id" integer NOT NULL, "fk_admin_id" integer NOT NULL, CONSTRAINT "PK_211f726fd8264e82ff7a2b86ce2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('client', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "dob" date NOT NULL, "email" character varying NOT NULL, "address" character varying NOT NULL, "country" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'client', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "document" ADD CONSTRAINT "FK_0e18e2bdd2ca779fddbb0cd5256" FOREIGN KEY ("fk_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "picture" ADD CONSTRAINT "FK_b74d671bada90473675c7050640" FOREIGN KEY ("fk_car_id") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rent" ADD CONSTRAINT "FK_767621d770cea37deb83303829e" FOREIGN KEY ("fk_car_id") REFERENCES "car"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rent" ADD CONSTRAINT "FK_f0cdf2f5e84e7032774d22c09f7" FOREIGN KEY ("fk_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rent" ADD CONSTRAINT "FK_cbf0151c580d9b37c682e0cf8b8" FOREIGN KEY ("fk_admin_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rent" DROP CONSTRAINT "FK_cbf0151c580d9b37c682e0cf8b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rent" DROP CONSTRAINT "FK_f0cdf2f5e84e7032774d22c09f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rent" DROP CONSTRAINT "FK_767621d770cea37deb83303829e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "picture" DROP CONSTRAINT "FK_b74d671bada90473675c7050640"`,
    );
    await queryRunner.query(
      `ALTER TABLE "document" DROP CONSTRAINT "FK_0e18e2bdd2ca779fddbb0cd5256"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(`DROP TABLE "rent"`);
    await queryRunner.query(`DROP TABLE "picture"`);
    await queryRunner.query(`DROP TYPE "public"."picture_type_enum"`);
    await queryRunner.query(`DROP TABLE "document"`);
    await queryRunner.query(`DROP TABLE "car"`);
  }
}
