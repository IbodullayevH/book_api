import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Books } from 'src/books/entities/book.entity';
import { UpdateOrderDto } from './dto/update.order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Books) private readonly booksRepository: Repository<Books>,
  ) { }


  // new order
  async create(createOrderDto: CreateOrderDto) {
    const newOrder = this.orderRepository.create(createOrderDto);

    newOrder.user = await this.userRepository.findOne({ where: { id: createOrderDto.userId } });
    if (!newOrder.user) {
      return "User not found"
    }

    if (!Array.isArray(createOrderDto.bookIds)) {
      return "bookIds must be an array"
    }
    newOrder.books = await this.booksRepository.findBy({ id: In(createOrderDto.bookIds) });

    const savedNewOrder = await this.orderRepository.save(newOrder);
    return {
      success: true,
      message: "Successfully created",
      data: {
        id: savedNewOrder.id,
        totalPrice: savedNewOrder.totalPrice,
        status: savedNewOrder.status,
        user: {
          id: savedNewOrder.user.id,
          username: savedNewOrder.user.username
        },
        books: savedNewOrder.books,
      }
    }
  }

  // get all
  async findAll() {
    const orders = await this.orderRepository.find({
      relations: ['user', 'books'],
      select: {
        user: {
          id: true,
          username: true
        }
      }
    });

    return {
      success: true,
      message: 'order data',
      data: orders,
    };
  }


  // by id
  async findOne(id: number) {
    let orders = await this.orderRepository.findOne({
      relations: ['user', 'books'],
      select: {
        user: {
          id: true,
          username: true
        }
      },
      where: { id },
    });

    if (!orders) {
      return {
        success: true,
        message: 'Not found order',
      }
    }
    return {
      success: true,
      message: 'order data',
      data: orders,
    };
  }

  // update order
  async update(orderId: number, orderData: UpdateOrderDto): Promise<{ success: boolean, message: string, data?: Order }> {
    const checkOrder = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'books']
    });

    if (!checkOrder) {
      return {
        success: false,
        message: 'Order not found',
      };
    }

    if (orderData.userId) {
      const user = await this.userRepository.findOne({ where: { id: orderData.userId } });
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }
      checkOrder.user = user;
    }

    if (orderData.bookIds && orderData.bookIds.length > 0) {
      const books = await this.booksRepository.findByIds(orderData.bookIds);
      if (books.length !== orderData.bookIds.length) {
        return {
          success: false,
          message: 'Some books not found',
        };
      }
      checkOrder.books = books;
    }

    // Qolgan ma'lumotlarni yangilash (totalPrice, status va h.k.)
    if (orderData.totalPrice) {
      checkOrder.totalPrice = orderData.totalPrice;
    }

    if (orderData.status) {
      checkOrder.status = orderData.status;
    }

    // Orderni saqlash
    await this.orderRepository.save(checkOrder);

    const updatedOrder = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'books']
    });

    return {
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder,
    };
  }

  // Delete order by id
  async remove(orderId: number): Promise<{ success: boolean, message: string }> {
    const checkOrder = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!checkOrder) {
      return {
        success: false,
        message: 'Order not found',
      };
    }

    await this.orderRepository.delete(orderId);

    return {
      success: true,
      message: 'Order deleted successfully',
    };
  }

}
