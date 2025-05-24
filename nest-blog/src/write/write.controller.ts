import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { WriteService } from './write.service';

@Controller('write')
export class WriteController {
    constructor(private readonly writeService: WriteService){}

    @Post()
    createArticle(){

    }

    @Put()
    updateArticle(){

    }

    @Delete()
    deleteArticle(){

    }

    @Post('image')
    uploadImage(){

    }

    @Get('category')
    getCategory(){

    }
}
