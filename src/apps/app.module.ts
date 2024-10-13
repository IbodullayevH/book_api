import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { BooksModule } from 'src/books/books.module';
import { Books } from 'src/books/entities/book.entity';
import { Order } from 'src/orders/entities/order.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { CartsModule } from 'src/carts/carts.module';
import { Cart } from 'src/carts/entities/cart.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '8077',
      database: 'booksstore',
      entities: [User, Books, Order, Cart],
      synchronize: true,
      // logging: true
    }),
    UsersModule,
    BooksModule,
    OrdersModule,
    CartsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
