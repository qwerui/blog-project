import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Blog {
    @PrimaryColumn()
    blogId: string;
    
    @Column()
    title: string;

    @Column()
    id: string;

    @Column()
    description: string;

    @Column()
    image: string;
}