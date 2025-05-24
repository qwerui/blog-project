import { Controller, Get } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) {}

    @Get('list')
    getList(){
        return this.blogService.getList();
    }

    @Get('article')
    getArticle(){
        return this.blogService.getArticle();
    }

    @Get('info')
    getInfo(){
        return this.blogService.getInfo();
    }

    @Get('search')
    search(){
        return this.blogService.search();
    }
}
