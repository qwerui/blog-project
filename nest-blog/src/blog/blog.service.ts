import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/entity/article.entity';
import { Blog } from 'src/entity/blog.entity';
import { Category } from 'src/entity/category.entity';
import { Member } from 'src/entity/member.entity';
import { Like, Not, Repository } from 'typeorm';

@Injectable()
export class BlogService {

    constructor(@InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
                @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
                @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
                @InjectRepository(Member) private readonly memberRepository: Repository<Member>) {}

    async getList(id: string, page: number, categoryId: number) {

        const currentPage = page ? page : 0;

        let articleCount = null;

        const blog = await this.blogRepository.findOne({
            where: {
                id: id
            }
        });


        if(categoryId == null) {
            articleCount = await this.articleRepository.count({
                where: {
                    blog_id: blog.blog_id,
                    deleted: false
                }
            });
        } else {
            articleCount = await this.articleRepository.count({
                where: {
                    blog_id: blog.blog_id,
                    deleted: false,
                    category_id: categoryId
                },
            });
        }

        if(articleCount == 0) {
            throw new NotFoundException();
        }

        const totalPage = (articleCount - 1) / 10 + 1;

        let articles = null;

        if(categoryId == null) {
            articles = await this.articleRepository.find({
                where: {
                    blog_id: blog.blog_id,
                    deleted: false
                },
                order: {
                    create_time: "DESC"
                },
                skip: currentPage * 10,
                take: 10
            });
        } else {
            articles = await this.articleRepository.find({
                where: {
                    blog_id: blog.blog_id,
                    deleted: false,
                    category_id: categoryId
                },
                order: {
                    create_time: "DESC"
                },
                skip: currentPage * 10,
                take: 10
            });
        }

        return {
            totalPage: totalPage,
            articles: articles
        };
    }


    async getArticle(articleId: string) {
        const article = await this.articleRepository.findOne({
            where: {
                article_id: articleId,
                deleted: false
            }
        });

        const category = await this.categoryRepository.findOne({
            select: {
                name: true
            },
            where: {
                blog_id: article.blog_id,
                category_id: article.category_id
            }
        });

        const blogUser = await this.blogRepository.findOne({
            select: {
                id: true
            },
            where: {
                blog_id: article.blog_id
            }
        });

        return {
            ...article,
            ...category,
            ...blogUser
        }
    }


    async getInfo(id: string) {

        const member = await this.memberRepository.findOne({
            where: {
                id: id
            }
        });

        const blog = await this.blogRepository.findOne({
            where: {
                id: id
            }
        });

        const category = await this.categoryRepository.find({
            where: {
                blog_id: id
            }
        });

        return {
            ...member,
            ...blog,
            category: category
        }
    }


    async search(search: string) {
        const articles = await this.articleRepository.find({
            select: {
                article_id: true,
                blog_id: true,
                create_time: true,
                title: true
            },
            where: {
                title: Like(`%${search}%`),
                deleted: false
            }
        });

        return articles;
    }
}
