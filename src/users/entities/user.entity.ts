import { Cart } from "src/carts/entities/cart.entity";
import { Order } from "src/orders/entities/order.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    password_hash: string;

    @Column({ default: 'user', enum: ['user', 'admin'] })
    role: string;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[]; // Bu yerda orders bo'lishi kerak, bitta emas

    @OneToMany(() => Cart, (cart) => cart.user)
    carts: Cart[];
}
