import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Article {
    @PrimaryColumn()
    article_id: string;

    @Column()
    title: string;
    
    @Column()
    blog_id: string;
    
    @Column()
    content: string;
    
    @Column()
    create_time: Date;
    
    @Column({nullable: true})
    category_id: number;

    @Column()
    deleted: boolean;
}