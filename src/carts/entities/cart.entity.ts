import { Books } from "src/books/entities/book.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('Carts')
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.carts) // user.carts
    user: User; // Bu yerda user maydoni borligini ko'rsatayapmiz.

    @ManyToMany(() => Books)
    @JoinTable()
    books: Books[];
}
