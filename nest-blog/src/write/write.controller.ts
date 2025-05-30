import { Body, Controller, Delete, FileTypeValidator, Get, ParseFilePipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { WriteService } from './write.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('write')
export class WriteController {
    constructor(private readonly writeService: WriteService){}

    @Post()
    @UseGuards(JwtAuthGuard)
    createArticle(@Body('blogId') blogId: string, @Body('title') title: string, @Body('category') category: number, @Body('content') content: string){
        return this.writeService.createArticle(blogId, title, category, content);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    updateArticle(@Body('blogId') blogId: string, @Body('title') title: string, @Body('category') category: number, @Body('content') content: string, @Body('articleId') articleId: string){
        return this.writeService.updateArticle(blogId, title, category, content, articleId);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    deleteArticle(@Body('articleId') articleId: string){
        return this.writeService.deleteArticle(articleId);
    }

    @Post('image')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    uploadImage(@UploadedFile(new ParseFilePipe({validators:[new FileTypeValidator({fileType:/^image\/.*/})]})) file: Express.Multer.File){
        
    }

    @Get('category')
    getCategory(@Query('id') id: string){
        return this.writeService.getCategory(id);
    }
}
