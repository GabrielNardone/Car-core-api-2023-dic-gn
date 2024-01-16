import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { configuration } from '@configuration/configuration';
import { configurationValidate } from '@configuration/configuration.validate';
import { datasourceOptions } from '@configuration/orm.configuration';

import { CommonModule } from '@common/common.module';

import { AuthorModule } from '@/modules/author/author.module';
import { BookModule } from '@/modules/book/book.module';
import { CarModule } from '@/modules/car/car.module';
import { UserModule } from '@/modules/user/user.module';

import { DocumentModule } from './modules/document/document.module';
import { PictureModule } from './modules/picture/picture.module';
import { RentModule } from './modules/rent/rent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: configurationValidate,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...datasourceOptions,
        autoLoadEntities: true,
      }),
      dataSourceFactory: async (options) => {
        return new DataSource(options).initialize();
      },
    }),
    CommonModule,
    AuthorModule,
    BookModule,
    UserModule,
    CarModule,
    PictureModule,
    RentModule,
    DocumentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
