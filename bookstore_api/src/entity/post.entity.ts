import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Admin } from "./admin.entity";
import { Comment } from "./comment.entity";
import { Customer } from "./customer.entity";



@Entity()
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Customer)
    customer: Customer;

    @Column({length: 256})
    title: string;

    @Column({length: 1000})
    content: string;

    @Column({default: false})
    approved: boolean

    @ManyToOne(() => Admin)
    approvedBy: Admin;
    
    @Column()
    commentable: boolean;

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];
}