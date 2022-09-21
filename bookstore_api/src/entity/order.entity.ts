import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./customer.entity";
import { OrderItem } from "./orderItem.entity";
import { Voucher } from "./voucher.entity";

export enum OrderStatus {
    pending = 'Pending',
    cancelled = 'Cancelled',
    success = 'Success'
}


@Entity()
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({
        name: 'purchaseDate',
    })
    purchaseDate: Date;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.pending
    })
    orderStatus: OrderStatus

    @Column('decimal')
    total: number;

    @Column('varchar', {length: 1000})
    address: string;

    @OneToOne(() => Voucher, {nullable: true})
    @JoinColumn()
    voucher: Voucher;

    @ManyToOne(() => Customer)
    customer: Customer;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    orderItems: OrderItem[];
}