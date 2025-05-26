import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Category {
    
    @PrimaryColumn()
    categoryId: number;
    
    @PrimaryColumn()
    blogId: string;
    
    @Column()
    name: string;
}