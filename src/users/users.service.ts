import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
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
      message: 'User updated successfully',
      data: updatedUser,
    };
  }

  // delete user by id
  async remove(userId: number): Promise<{ success: boolean, message: string }> {
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

    await this.userRepository.delete(userId);

    return {
      success: true,
      message: 'User deleted successfully',
    };
  }

}
