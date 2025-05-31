import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { Article } from 'src/entity/article.entity';
import { Blog } from 'src/entity/blog.entity';
import { Category } from 'src/entity/category.entity';
import { Repository } from 'typeorm';
import { v7 } from 'uuid';


@Injectable()
export class WriteService {

    constructor(@InjectRepository(Article) private readonly articleRepository: Repository<Article>,
                @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
                @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>){}

    createArticle(blogId: string, title: string, category: number, content: string) {
        
        this.articleRepository.save({
            article_id: v7(),
            blog_id: blogId,
            title: title,
            category_id: category,
            content: content,
            create_time: DateTime.utc().toJSDate(),
            deleted: false
        });
    }


    async updateArticle(blogId: string, title: string, category: number, content: string, articleId: string) {
        const article = await this.articleRepository.findOne({
            where: {
                article_id: articleId
            }
        });

        article.category_id = category;
        article.content = content;
        article.title = title;

        this.articleRepository.save(article);
    }


    async deleteArticle(articleId: string) {
        await this.articleRepository.update({
            article_id: articleId
        },{
            deleted: true
        });
    }

    async getCategory(id: string) {
        const blog = await this.blogRepository.findOne({
            where: {
                id: id
            }
        });

        const categories = await this.categoryRepository.find({
            select: {
                category_id: true,
                name: true
            },
            where: {
                blog_id: blog.blog_id
            }
        });

        return {
            blog_id: blog.blog_id,
            category: categories
        }
    }
}
