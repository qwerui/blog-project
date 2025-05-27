import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
    
    @PrimaryGeneratedColumn()
    category_id: number;
    
    @PrimaryColumn()
    blog_id: string;
    
    @Column()
    name: string;
}