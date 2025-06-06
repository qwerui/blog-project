import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogController } from './blog/blog.controller';
import { ConfigService } from './config/config.service';
import { ConfigController } from './config/config.controller';
import { WriteService } from './write/write.service';
import { WriteController } from './write/write.controller';
import { BlogService } from './blog/blog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { Article } from './entity/article.entity';
import { Blog } from './entity/blog.entity';
import { Category } from './entity/category.entity';
import { MulterModule } from '@nestjs/platform-express';
import { Member } from './entity/member.entity';
import { Type } from 'class-transformer';
import { ServeStaticModule } from '@nestjs/serve-static';

const mysql = TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'blog',
  entities: [Article, Blog, Category, Member],
  synchronize: true,
});

const mysqlFeature = TypeOrmModule.forFeature([Article, Blog, Category, Member]);

const staticAssets = ServeStaticModule.forRoot({
  rootPath: './public',
  serveRoot: '/public',
});

const multer = MulterModule.register({
  dest: './public/images/article',
});


@Module({
  imports: [mysql, ConfigModule.forRoot(), AuthModule, multer, mysqlFeature, staticAssets],
  controllers: [AppController, BlogController, WriteController, ConfigController],
  providers: [AppService, BlogService, WriteService, ConfigService],
})

export class AppModule {}

