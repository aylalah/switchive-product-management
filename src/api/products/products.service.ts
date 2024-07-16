import { HttpService, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Event, formatPhoneNumber, getTier, isNullOrUndefined, isNumeric } from '../../utils';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product) public productRepository: Repository<Product>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  create(data: Partial<Product>): Promise<Product> {
    return this.productRepository.save(data);
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  findOne(id: string): Promise<Product> {
    return this.productRepository.findOne(id);
  }

  async update(id: string, data: Partial<Product>) {

    const result = await this.productRepository.update(id, { ...data });

    return result
  }

  remove(id: string): Promise<DeleteResult> {
    return this.productRepository.delete(id);
  }
}
