import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./book.entity";

@Entity()
export class Image extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column('varchar', {length: 1000})
    url: string

    @ManyToOne(() => Book, (book) => book.images)
    book: Book;
}