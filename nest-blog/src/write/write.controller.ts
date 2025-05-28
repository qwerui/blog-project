import { Controller, Delete, FileTypeValidator, Get, ParseFilePipe, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { WriteService } from './write.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('write')
export class WriteController {
    constructor(private readonly writeService: WriteService){}

    @Post()
    createArticle(){
        return this.writeService.createArticle
    }

    @Put()
    updateArticle(){
        return this.writeService.updateArticle();
    }

    @Delete()
    deleteArticle(){
        return this.writeService.deleteArticle();
    }

    @Post('image')
    @UseInterceptors(FileInterceptor('file'))
    uploadImage(@UploadedFile(new ParseFilePipe({validators:[new FileTypeValidator({fileType:/^image\/.*/})]})) file: Express.Multer.File){
        
    }

    @Get('category')
    getCategory(){
        return this.writeService.getCategory();
    }
}
