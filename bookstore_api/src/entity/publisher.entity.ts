import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./book.entity";

@Entity()
export class Publisher extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 256,
  })
  name: string;

  @Column("boolean", { default: false })
  deleted: boolean;

  @OneToMany(() => Book, (book) => book.publisher )
  books: Book[];

}