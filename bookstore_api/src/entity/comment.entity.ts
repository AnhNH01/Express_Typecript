import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./customer.entity";
import { Post } from "./post.entity";

@Entity() 
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Customer)
    customer: Customer;

    @CreateDateColumn()
    time: Date;

    @Column({length: 256})
    content: string

    @ManyToOne(() => Post, (post) => post.comments)
    post: Post;
}