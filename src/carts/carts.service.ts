import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Books } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Books)
    private readonly booksRepository: Repository<Books>,
  ) { }

  // Create a new cart
  async create(createCartDto: CreateCartDto) {
    const { userId, bookIds } = createCartDto;

    // Foydalanuvchini tekshirish
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Kitoblarni tekshirish
    const books = await this.booksRepository.findBy({
      id: In(bookIds),
    });
    if (!books.length) {
      throw new NotFoundException('Books not found');
    }

    // Savat yaratish
    const newCart = this.cartRepository.create({
      user,
      books,
    });

    return this.cartRepository.save(newCart);
  }

  // Return all carts
  findAll() {
    return this.cartRepository.find({ relations: ['user', 'books'] });
  }

  // Return one cart by id
  findOne(id: number) {
    return this.cartRepository.findOne({
      where: { id },
      relations: ['user', 'books'],
    });
  }

  // Update a cart
  async update(id: number, updateCartDto: UpdateCartDto) {
    const { userId, bookIds } = updateCartDto;

    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['user', 'books'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Agar user yangilanishi kerak bo'lsa
    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      cart.user = user;
    }

    // Agar kitoblar yangilanishi kerak bo'lsa
    if (bookIds) {
      const books = await this.booksRepository.findBy({
        id: In(bookIds),
      });
      if (!books.length) {
        throw new NotFoundException('Books not found');
      }
      cart.books = books;
    }

    return this.cartRepository.save(cart);
  }

  // Remove a cart
  async remove(id: number) {
    const cart = await this.cartRepository.findOne({ where: { id } });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.cartRepository.remove(cart);
    return { success: true, message: 'Cart deleted successfully' };
  }
}
