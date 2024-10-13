import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Books } from 'src/books/entities/book.entity';
import { UsersModule } from 'src/users/users.module';
import { BooksModule } from 'src/books/books.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, User, Books]),
  CartsModule,
  UsersModule,
  BooksModule
],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
