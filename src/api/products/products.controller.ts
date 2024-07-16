
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  forwardRef,
  Inject,
  Query,
  Put,
} from '@nestjs/common';
import { JwtGuard } from '../auth/jwt-strategy/jwt.guard';
import { GetUser } from '../../decorators';
import {
  error,
  Event,
  makeFilter,
  random,
  hash,
  randomDigits,
  success,
} from '../../utils';
import { User } from '../user/entities/user.entity';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto, GetProductParamsDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import * as moment from "moment";
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MailService } from '../../mail/mail.service';
const path = require("path");

@ApiTags('Product Managements')
@Controller('products')
export class ProductsController {

  constructor(
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async create(@Body() createProductDto: CreateProductDto, @GetUser() authUser: User) {

    console.log('CreateProductDto', CreateProductDto);

    let {
      category,
      product_name,
      description,
      image,
      price,
    } = createProductDto; 

    const date = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
    let timeStamp = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss.SSS");
    let todatsDate = moment(new Date().getTime()).format("YYYY-MM-DD");

    const existingProduct = await this.productsService.productRepository.findOne({
        select: ['id', 'category', 'product_name', 'description', 'image', 'price', 'status'],
        where: { category, product_name },
      }) ?? null;

    // enforce unique email code
    if (existingProduct) {
      return error('Failed', 'Looks like product already exist');
    }

    try {

      const newProduct = await this.productsService.create({
        category,
        product_name,
        description,
        image,
        price: +price,
        created_by: authUser.id,
        created_at: todatsDate
      });

      let product = await this.productsService.findOne(newProduct.id)
  
      return success(
        product,
        'Successfull',
        'New product created',
      );
      
    } catch (error) {
      return success(
      'Failed',
        error.error.message,
      );
    }

  }

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async findAll(
    @Query() params: GetProductParamsDto,
  ) {
    const page = +params.page;
    const perPage = +params.per_page;
    // const category_id= params.category_id;
    const search = params.search;
    const from = params.from;
    const to = params.to;
    const _page = page < 1 ? 1 : page
    const _nextPage = _page + 1
    const _prevPage = _page - 1
    const _perPage = perPage
    const _filter = {
      take: perPage,
      skip: (page - 1) * perPage,

      where: makeFilter(search, from, to, [
        'category',
        'product_name',
        'description',
      ]),
    }
    const total = await this.productsService.productRepository.count(_filter);
    const products = await this.productsService.productRepository.find({
                                                                take: perPage,
                                                                skip: (page - 1) * perPage,
                                                                where: makeFilter(search, from, to, [
                                                                  'category',
                                                                  'product_name',
                                                                  'description',
                                                                ]),
                                                                order: {
                                                                  created_at: "DESC",
                                                              },
    });
    return success(
      products.map((product) => {
        return {
          ...product
        };
      }),
      'Get All',
      'Retrieve all products',
      {
        current_page: _page,
        next_page: _nextPage > total ? total : _nextPage,
        prev_page: _prevPage < 1 ? null : _prevPage,
        per_page: _perPage,
        total,
      }
    );
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(id);
    return success(
      product ? {
        ...product
      } : null,
      'Fetched',
      'Retrieve a single product by ID',
    );
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @GetUser() authUser: User) {

    console.log('CreateProductDto', CreateProductDto);

    let {
      category,
      product_name,
      description,
      image,
      price,
    } = updateProductDto; 

    const date = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
    let timeStamp = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss.SSS");
    let todatsDate = moment(new Date().getTime()).format("YYYY-MM-DD");

    try {

      const result = await this.productsService.update(id, {
        category,
        product_name,
        description,
        image,
        price: +price,
        updated_at: todatsDate,
        updated_by: authUser.id,
      });
  
      return success(
        await this.productsService.findOne(id),
        'Update Successful',
        'Update an existing product',
      );
    } catch (error) {
      return success(
        'Failed',
          error.error.message,
        );
    }

  } 

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {

    const result = await this.productsService.remove(id);
    return success(
      result,
      'Delete Successfull',
      'Delete a product',
    );
  }

}