import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Blog {
    @PrimaryColumn()
    blog_id: string;
    
    @Column({nullable: true})
    title: string;

    @Column()
    id: string;

    @Column({nullable: true})
    description: string;

    @Column({nullable: true})
    image: string;
}