import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authservice: AuthService

  ) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authservice.register(createUserDto);
  }


  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/profile')
  async update(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    const sub = req.user.id;
    const role = req.user.role;

    if (role !== 'user') {
      throw new UnauthorizedException(`Faqatgina userlar o'z profili malumotlarini yangilay oladi`)
    }
    return await this.usersService.update(sub, updateUserDto);

  }

  @Delete(':userId/:id')
  async remove(@Param('userId') userId: number, @Param('id') id: number) {
    return this.usersService.remove(userId, id);
  }
}
