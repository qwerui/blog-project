import { Body, Controller, FileTypeValidator, Get, ParseFilePipe, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService } from './config.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ConfigUpdateRequset } from 'src/dto/config.req';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {v4} from 'uuid';
import { join } from 'path';

const profileImagePath = join(__dirname, '..', '..', 'public','images','profile');

const profileImageMulter = {
    storage: diskStorage({
      destination: (req, file, cb) => {
        cb(null, profileImagePath);
      },
      filename: (req, file, cb) => {
        cb(null, v4());
      },
    }),
    fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/^image\/.*/)) {
      cb(new Error('Only image files are allowed!'), false);
    } else {
      cb(null, true);
    }
  },
}


@Controller('config')
export class ConfigController {
    constructor(private readonly configService: ConfigService){}

    @Put()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image', profileImageMulter))
    updateConfig(@Body() configReq:ConfigUpdateRequset, @UploadedFile(new ParseFilePipe({fileIsRequired: false})) image: Express.Multer.File) {

        if(!image.mimetype.match(/^image\/.*/)) {
            throw new Error('Only image files are allowed!');
        }

        const imagePath = image ? '/public/images/profile/' + image.filename : null;
        this.configService.updateConfig(configReq.blogId, configReq.title, configReq.description, imagePath, configReq.deleteCategory, configReq.newCategory);
    }

    @Get()
    getConfig(@Query('userId') userId: string) {
        return this.configService.getConfig(userId);
    }
}
