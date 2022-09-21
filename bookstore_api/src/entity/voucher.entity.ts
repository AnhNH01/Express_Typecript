import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Voucher extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 256,
  })
  name: string;

  @Column({
    type: "date",
    nullable: true,
  })
  start: Date;

  @Column({
    type: "date",
    nullable: true,
  })
  end: Date;

  @Column('float')
  value: number;

  @Column('decimal', {default: 0})
  minCartTotal: number;

  @Column('int')
  stock: number;

  @Column('varchar', {length: 256})
  description: string;
}
