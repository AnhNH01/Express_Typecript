import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Admin extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {length: 256})
    email: string;

    @Column('varchar', {length: 1000})
    password: string;

    @Column('varchar', {length: 1000, nullable: true})
    avatarUrl: string;

}