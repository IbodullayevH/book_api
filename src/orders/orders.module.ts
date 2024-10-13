import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Books } from 'src/books/entities/book.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Order, User, Books])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
