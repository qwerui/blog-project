import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Article {
    @PrimaryColumn()
    articleId: string;

    @Column()
    title: string;
    
    @Column()
    blogId: string;
    
    @Column()
    content: string;
    
    @Column()
    createTime: Date;
    
    @Column()
    categoryId: number;

    @Column()
    deleted: boolean;
}