import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Books } from './entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {

  constructor(
    @InjectRepository(Books)
    private bookRepository: Repository<Books>
  ) { }


  // create new book
  async create(createBookDto: CreateBookDto): Promise<{ success: boolean, message: string, data?: Books }> {
    let existBook = await this.bookRepository.findOne({
      where: {
        title: createBookDto.title
      }
    })

    if (existBook) {
      return {
        success: false,
        message: "Already exist book"
      }
    }

    let newBook = this.bookRepository.create(createBookDto)
    let savedNewBook = await this.bookRepository.save(newBook)

    return {
      success: true,
      message: "Successfully created new book",
      data: savedNewBook
    }
  }


  // get all 
  async findAll(): Promise<{ success: boolean, message: string, data?: Books[] }> {
    let bookData = await this.bookRepository.find()

    return {
      success: true,
      message: "All book data has been retrieved successfully",
      data: bookData
    }
  }


  // by id
  async findOne(id: number): Promise<Books> {
    let bookData = await this.bookRepository.findOneBy({ id });

    if (!bookData) {
      throw new NotFoundException("Not found book")
    }

    return bookData
  }


  // update book
  async update(bookId: number, updateBookDto: UpdateBookDto): Promise<{ success: boolean, message: string, data?: Books }> {
    let checkBook = await this.bookRepository.findOne({
      where: {
        id: bookId
      }
    });

    if (!checkBook) {
      return {
        success: false,
        message: 'Book not found',
      };
    }

    await this.bookRepository.update(bookId, updateBookDto);
    const updatedBook = await this.bookRepository.findOne({
      where: { id: bookId }
    });

    return {
      success: true,
      message: 'Book updated successfully',
      data: updatedBook,
    };
  }


  // delete book
  async remove(bookId: number): Promise<{ success: boolean, message: string, data?: Books }> {
    let checkBook = await this.bookRepository.findOne({
      where: {
        id: bookId
      }
    });

    if (!checkBook) {
      return {
        success: false,
        message: 'Book not found',
      };
    }
    await this.bookRepository.delete(bookId);

    return {
      success: true,
      message: 'Book deleted successfully',
    };
  }
}
