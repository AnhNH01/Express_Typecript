import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Author } from "./author.entity";
import { Genre } from "./genre.entity";
import { Image } from "./image.entity";
import { Publisher } from "./publisher.entity";

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 256 })
  isbn: string;

  @Column("varchar", { length: 256 })
  title: string;

  @Column()
  edition: number;

  @Column()
  stock: number;

  @Column("decimal", { nullable: true })
  price: number;

  @Column({ nullable: true })
  numberOfPages: number;

  @Column({
    type: "varchar",
    nullable: true,
  })
  thumbnailUrl: string;

  @Column({ nullable: true })
  description: string;

  @Column("boolean", { default: false })
  deleted: boolean;

  @ManyToOne(() => Publisher, (publisher) => publisher.books)
  publisher: Publisher;

  @ManyToMany(() => Genre)
  @JoinTable()
  genres: Genre[];

  @OneToMany(() => Image, (image) => image.book)
  images: Image[];

  @ManyToMany(() => Author)
  @JoinTable()
  authors: Author[];
}