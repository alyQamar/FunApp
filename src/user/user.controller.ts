import { Controller, Get, Post, Body, Param, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';
import { GetUserDto } from './dto/get-user.dto';


@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get(':userId')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'userId', type: 'integer', description: 'The ID of the user to retrieve' })
  @ApiResponse({ status: 200, description: 'The user has been successfully retrieved.', type: GetUserDto })
  @ApiResponse({ status: 400, description: 'Bad Request: The user ID provided is invalid.' })
  @ApiResponse({ status: 404, description: 'User not found: The user with the provided ID does not exist.' })

  async getUser(@Param('userId', ParseIntPipe) userId: string): Promise<GetUserDto> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new BadRequestException('Invalid or expired user token');
    }

    return user;
  }


  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: User })
  @ApiResponse({ status: 400, description: 'Bad Request: The email already exists, or signup is restricted to Egypt.' })
  async signUp(@Body() signUpDto: SignUpDto): Promise<User> {
    try {
      return this.userService.create(signUpDto);
    } catch (error) {
      throw new BadRequestException('Sign up failed');
    }
  }
}
