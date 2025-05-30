import { Controller, Get, Query } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) {}

    @Get('list')
    getList(@Query('id') id: string, @Query('page') page: number, @Query('categoryId') categoryId: number){
        return this.blogService.getList(id, page, categoryId);
    }

    @Get('article')
    getArticle(@Query('articleId') articleId: string){
        return this.blogService.getArticle(articleId);
    }

    @Get('info')
    getInfo(@Query('id') id: string){
        return this.blogService.getInfo(id);
    }

    @Get('search')
    search(@Query('search') search: string){
        return this.blogService.search(search);
    }
}
