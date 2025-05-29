import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Member {
    @PrimaryColumn()
    id: string;

    @Column()
    password: string;

    @Column()
    nickname: string;
}