import { forwardRef, Module } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { ServicesModule } from '../../services';

@Module({
  imports: [TypeOrmModule.forFeature([Product, User]), ServicesModule],
  controllers: [ProductsController],
  providers: [ProductsService, UserService],
  exports: [ProductsService, UserService],
})

export class ProductsModule {}
