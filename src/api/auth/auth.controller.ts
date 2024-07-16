import {
  Body,
  Controller,
  forwardRef,
  Get,
  Param,
  Inject,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './local-strategy/local.guard';
import { JwtGuard } from './jwt-strategy/jwt.guard';
import {
  success,
  Event,
} from '../../utils';
import { EventEmitter2 } from 'eventemitter2';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User, UserService } from '../user';
import { RegisterUserDto } from './dto/create-user.dto';
import { LoginUserDto, RefreshTokenDto } from './dto/update-user.dto';
import { GetUser } from '../../decorators';
import * as moment from "moment";
// import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../../mail/mail.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

let todatsDate = moment(new Date().getTime()).format("YYYY-MM-DD");

@ApiTags('Authentication Managements')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly authService: AuthService,
    private readonly eventEmitter: EventEmitter2,
    // private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Body() user: LoginUserDto, @GetUser() authUser: User) {
    this.eventEmitter.emit(Event.USER_BEFORE_LOGIN, { user });
    const token = await this.authService.login(authUser);


    if (authUser?.status == false) {
      throw new UnauthorizedException('Your account have not been activated by the admin');
    }

    else{
        return success(
          {
            token: token.token,
            id: authUser.id,
            email:authUser.email,
            password: null,
          },
          'Sign In',
          'Sign in was successful',
        );
    }

  }

  @Get('profile')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  async user(@GetUser() authUser: User) {
    const user = await this.userService.findOne(authUser.id);
    return success(
      {
        ...user,
        password: null
      },
      'User Profile',
      'User profile details',
    );
  }

}
