import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { WriteService } from './write.service';

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
    uploadImage(){
        return this.writeService.uploadImage();
    }

    @Get('category')
    getCategory(){
        return this.writeService.getCategory();
    }
}
