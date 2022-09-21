import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./book.entity";
import { CartItem } from "./cartItem.entity";
import { Customer } from "./customer.entity";

@Entity()
export class Cart extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Customer)
    @JoinColumn()
    customer: Customer;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
    cartItems: CartItem[];

    @OneToOne(() => Book)
    @JoinColumn()
    book: Book;

    @Column('int')
    quantity: number;
}
