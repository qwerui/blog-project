import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogController } from './blog/blog.controller';
import { ConfigService } from './config/config.service';
import { ConfigController } from './config/config.controller';
import { WriteService } from './write/write.service';
import { WriteController } from './write/write.controller';
import { BlogService } from './blog/blog.service';

@Module({
  imports: [],
  controllers: [AppController, BlogController, WriteController, ConfigController],
  providers: [AppService, BlogService, WriteService, ConfigService],
})
export class AppModule {}
