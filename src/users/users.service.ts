import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>
  ) { }

  // create new user
  async create(createUserDto: CreateUserDto): Promise<{ success: boolean, message: string, data?: CreateUserDto }> {
    let existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email
      }
    });

    if (existUser) {
      return {
        success: false,
        message: 'User already exists',
      };
    }

    const newUser = this.userRepository.create(createUserDto);
    let savedNewUser = await this.userRepository.save(newUser)
    return {
      success: true,
      message: "Success",
      data: savedNewUser
    }
  }

  // get all users
  async findAll(): Promise<{ success: boolean; message: string; data: User[] }> {
    const users = await this.userRepository.find();
    return {
      success: true,
      message: 'Users data',
      data: users,
    };
  }


  // get by id
  async findOne(id: number): Promise<{ success: boolean, message: string, data?: User }> {
    let userById = await this.userRepository.findOne({ where: { id } });

    if (!userById) {
      return {
        success: false,
        message: `User with id ${id} not found`,
      }
    }

    return {
      success: true,
      message: `User by id ${id}`,
      data: userById,
    }
  }


  // update user by id
  async update(userId: number, userData: Partial<User>): Promise<{ success: boolean, message: string, data?: User }> {
    let checkUser = await this.userRepository.findOne({
      where: {
        id: userId
      }
    });

    if (!checkUser) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    await this.userRepository.update(userId, userData);
    const updatedUser = await this.userRepository.findOne({
      where: { id: userId }
    });

    return {
      success: true,
      message: 'Your profile updated successfully',
      data: updatedUser,
    };
  }

  // delete user by id
  async remove(userId: number, id: number): Promise<{ success: boolean, message: string }> {

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['orders'],
    });

    if (!user) {
      return {
        success: false,
        message: `User with id ${id} not found`,
      }
    }

    await this.orderRepository.delete({ user: { id: user.id } });


    await this.userRepository.delete(userId);

    return {
      success: true,
      message: 'User deleted successfully',
    };
  }

  // find by email
  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  // find by id
  async findById(id: number): Promise<User | undefined> {
    let userData = this.userRepository.findOne({ where: { id } });
    // console.log(userData);
    
    return userData
  }
}
