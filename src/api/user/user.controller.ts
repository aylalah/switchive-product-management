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
import { UserService } from './user.service';
import {
  UpdateUserDto,
} from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import * as moment from "moment";
import { User } from './entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MailService } from '../../mail/mail.service';
const path = require("path");

@ApiTags('Users Managements')
@Controller('users')
export class UserController {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @ApiBearerAuth()
  async create(@Body() createUserDto: CreateUserDto) {

    this.eventEmitter.emit(Event.USER_BEFORE_REGISTER, { createUserDto });

    let {
      first_name,
      last_name,
      email,
      password,
    } = createUserDto; 

    const date = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
    let timeStamp = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss.SSS");
    let todatsDate = moment(new Date().getTime()).format("YYYY-MM-DD");

    const existingUser = await this.userService.userRepository.findOne({
        select: ['id', 'first_name', 'email'],
        where: [{ email }],
      }) ?? null;

    // enforce unique email code
    if (existingUser) {
      return error('Registration', 'Looks like you already have an account. Email already exist');
    }

    try {

      const newUser = await this.userService.create({
        first_name,
        last_name,
        email,
        status: true,
        password: hash(password),
        created_by: 'Web Master',
        created_at: todatsDate
      });
  
      this.eventEmitter.emit(Event.NEVER_BOUNCE_VERIFY, { user: newUser });
      this.eventEmitter.emit(Event.USER_AFTER_REGISTER, {
        user: {
          ...newUser,
          password: null,
        },
      });
  
      return success({
          id: newUser.id,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          email: newUser.email,
        },
        'User Registration',
        'User successfully registered',
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
    @Query('page') page: number = 1,
    @Query('per_page') perPage: number = 12,
    @Query('search') search?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const _page = page < 1 ? 1 : page
    const _nextPage = _page + 1
    const _prevPage = _page - 1
    const _perPage = perPage
    const _filter = {
      take: perPage,
      skip: (page - 1) * perPage,

      where: makeFilter(search, from, to, [
        'first_name',
        'last_name',
        'email',
      ]),
    }
    const total = await this.userService.userRepository.count(_filter);
    const users = await this.userService.userRepository.find({
                                                                take: perPage,
                                                                skip: (page - 1) * perPage,
                                                                where: makeFilter(search, from, to, [
                                                                  'first_name',
                                                                  'last_name',
                                                                  'email',
                                                                ]),
                                                                order: {
                                                                  created_at: "DESC",
                                                              },
    });
    return success(
      users.map((user) => {
        return {
          ...user,
          password: null,
        };
      }),
      'Users',
      'Users list',
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
    const user = await this.userService.findOne(id);
    return success(
      user ? {
        ...user,
        password: null,
      } : null,
      'Users',
      'User details',
    );
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() user: UpdateUserDto, @GetUser() authUser: User) {

    const date = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
    let timeStamp = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss.SSS");
    let todatsDate = moment(new Date().getTime()).format("YYYY-MM-DD");

    try {

      const result = await this.userService.update(id, {
        ...user,
        updated_at: todatsDate,
        updated_by: authUser.id,
      });
  
      return success(
        {
          id,
          user: await this.userService.findOne(id)
        },
        'Users',
        'User details updated',
      );
    } catch (error) {
      return success(
        'Failed',
          error.error.message,
        );
    }

  } 

}
