import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from 'src/entity/blog.entity';
import { Category } from 'src/entity/category.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class ConfigService {

    constructor(@InjectRepository(Blog) private blogRepository: Repository<Blog>,
                @InjectRepository(Category) private categoryRepository: Repository<Category>){}

    async updateConfig(blogId: string, title: string, description: string, imagePath: string, deleteCategory?: Array<number>, newCategory?: Array<string>) {
        const blog = await this.blogRepository.findOne({
            where: {
                blog_id: blogId
            }
        });

        blog.title = title;
        blog.description = description;

        if(imagePath != null) {
            blog.image = imagePath;
        }

        if(deleteCategory.length > 0) {
            this.categoryRepository.delete({
                blog_id: blogId,
                category_id: In(deleteCategory)
            });
        }

        if(newCategory.length > 0) {
            const batch = newCategory.map(item => {
                const result = new Category();
                result.blog_id = blogId;
                result.name = item;
                return result;
            });
            this.categoryRepository.save(batch);
        }
    }

    async getConfig(userId: string) {
        const blog = await this.blogRepository.findOne({
            where: {
                id: userId
            }
        });

        const category = await this.categoryRepository.find({
            select: {
                category_id: true,
                name: true
            },
            where: {
                blog_id: blog.blog_id
            }
        });

        const result = {
            ...blog,
            category: category
        }

        return result;
    }
}
