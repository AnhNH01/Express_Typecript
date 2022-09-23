import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


export enum Gender {
    male = 'Male',
    female = 'Female',
    other = 'Other'
}

@Entity()
export class Customer extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @Column('varchar', {length: 256, unique: true})
    email: string;

    @Column('varchar', { length:1000 })
    password: string;

    @Column('varchar')
    phoneNumber: string;

    @Column('enum', {
        enum: Gender,
        default: Gender.other
    })
    gender: Gender

    @Column('date', {nullable: true})
    dateOfBirth: Date;

    @Column('varchar', {length: 1000, nullable: true})
    avatarUrl: string;

}

