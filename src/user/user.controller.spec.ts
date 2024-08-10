import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { GetUserDto } from './dto/get-user.dto';
import { User } from './user.entity';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('getUser', () => {
    it('should return a user if found', async () => {
      const userId = '1';
      const user = { id: 1, name: 'Aly', email: 'aly@gmail.com' } as GetUserDto;

      mockUserService.findOne.mockResolvedValue(user);

      const result = await userController.getUser(userId);

      expect(result).toEqual(user);
      expect(mockUserService.findOne).toHaveBeenCalledWith(userId);
    });

    it('should throw a BadRequestException if user not found', async () => {
      const userId = '1';
      mockUserService.findOne.mockResolvedValue(undefined);

      await expect(userController.getUser(userId)).rejects.toThrow(BadRequestException);
      expect(mockUserService.findOne).toHaveBeenCalledWith(userId);
    });

    it('should throw a BadRequestException if an invalid userId is provided', async () => {
      const userId = 'invalid-id';

      mockUserService.findOne.mockImplementation(() => {
        throw new BadRequestException('Invalid user ID');
      });

      await expect(userController.getUser(userId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('signUp', () => {
    it('should create and return a user if valid data is provided', async () => {
      const signUpDto: SignUpDto = {
        name: 'Aly',
        email: 'aly@gmail.com',
        latitude: 30.033333,
        longitude: 31.233334,
      };

      const createdUser = { ...signUpDto, id: 1, city: 'Cairo' } as User;

      mockUserService.create.mockResolvedValue(createdUser);

      const result = await userController.signUp(signUpDto);

      expect(result).toEqual(createdUser);
      expect(mockUserService.create).toHaveBeenCalledWith(signUpDto);
    });

    it('should throw a BadRequestException if email already exists', async () => {
      const signUpDto: SignUpDto = {
        name: 'Aly',
        email: 'aly@gmail.com',
        latitude: 30.033333,
        longitude: 31.233334,
      };

      mockUserService.create.mockImplementation(() => {
        throw new BadRequestException('Email already exists');
      });

      await expect(userController.signUp(signUpDto)).rejects.toThrow(BadRequestException);
      expect(mockUserService.create).toHaveBeenCalledWith(signUpDto);
    });

    it('should throw a BadRequestException if signup fails', async () => {
      const signUpDto: SignUpDto = {
        name: 'Aly',
        email: 'aly@gmail.com',
        latitude: 30.033333,
        longitude: 31.233334,
      };

      mockUserService.create.mockImplementation(() => {
        throw new Error('Signup failed');
      });

      await expect(userController.signUp(signUpDto)).rejects.toThrow(BadRequestException);
      expect(mockUserService.create).toHaveBeenCalledWith(signUpDto);
    });
  });
});
