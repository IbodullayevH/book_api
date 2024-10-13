import { Books } from "src/books/entities/book.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('Orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.orders)
    user: User;

    @ManyToMany(() => Books)
    @JoinTable()
    books: Books[];

    @Column()
    totalPrice: number;

    @Column({ default: 'pending', enum: ['pending', 'completed', 'canceled'] })
    status: string;
}
