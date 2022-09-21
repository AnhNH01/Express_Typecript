import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./book.entity";
import { Order } from "./order.entity";

@Entity()
export class OrderItem extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, (order) => order.orderItems)
    order: Order;

    @OneToOne(() => Book)
    @JoinColumn()
    book: Book;

    @Column()
    quantity: number;

    @Column('decimal')
    unitPrice: number;
}