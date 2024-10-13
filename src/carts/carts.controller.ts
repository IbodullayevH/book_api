import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }

  @Post()
  async create(@Body() createCartDto: CreateCartDto) {
    try {
      const result = await this.cartsService.create(createCartDto);
      return { success: true, data: result };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get()
  async findAll() {
    return this.cartsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const result = await this.cartsService.findOne(+id);
      if (!result) {
        throw new NotFoundException('Cart not found');
      }
      return result;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    try {
      const result = await this.cartsService.update(+id, updateCartDto);
      return { success: true, data: result };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.cartsService.remove(+id);
      return result;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
