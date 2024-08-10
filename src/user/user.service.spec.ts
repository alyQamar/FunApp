import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as NodeGeocoder from 'node-geocoder';
import { SignUpDto } from './dto/sign-up.dto';

jest.mock('node-geocoder', () => {
  return jest.fn().mockImplementation(() => ({
    reverse: jest.fn(),
  }));
});

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockGeocoder = {
    reverse: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    service['geocoder'] = mockGeocoder as unknown as NodeGeocoder.Geocoder;
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const userId = '1';
      const user = { id: 1, name: 'Aly', email: 'aly@gmail.com' } as User;
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne(userId);

      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: Number(userId) } });
    });

    it('should throw a NotFoundException if user not found', async () => {
      const userId = '1';
      mockUserRepository.findOne.mockResolvedValue(undefined);

      await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('reverseGeocode', () => {
    it('should return city and country if location found', async () => {
      const latitude = 51.5074;
      const longitude = -0.1278;
      const location = { city: 'London', country: 'United Kingdom' };

      mockGeocoder.reverse.mockResolvedValue([location]);

      const result = await service['reverseGeocode'](latitude, longitude);

      expect(result).toEqual(location);
      expect(mockGeocoder.reverse).toHaveBeenCalledWith({ lat: latitude, lon: longitude });
    });

    it('should throw a BadRequestException if no location found', async () => {
      const latitude = 91;
      const longitude = 181;

      mockGeocoder.reverse.mockResolvedValue([]);

      await expect(service['reverseGeocode'](latitude, longitude)).rejects.toThrow(BadRequestException);
      expect(mockGeocoder.reverse).toHaveBeenCalledWith({ lat: latitude, lon: longitude });
    });

    it('should throw a BadRequestException if geocoding error occurs', async () => {
      const latitude = -33.8688;
      const longitude = 151.2093;

      mockGeocoder.reverse.mockRejectedValue(new Error('Geocoding error'));

      await expect(service['reverseGeocode'](latitude, longitude)).rejects.toThrow(BadRequestException);


      expect(mockGeocoder.reverse).toHaveBeenCalledWith({ lat: latitude, lon: longitude });
    });
  });

  describe('create', () => {
    it('should create and save a new user if valid data is provided', async () => {
      const signUpDto: SignUpDto = {
        name: 'Aly',
        email: 'aly@gmail.com',
        latitude: 30.033333,
        longitude: 31.233334,
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockGeocoder.reverse.mockResolvedValue([{ city: 'Cairo', country: 'Egypt' }]);
      mockUserRepository.create.mockReturnValue(signUpDto as User);
      mockUserRepository.save.mockResolvedValue(signUpDto as User);

      const result = await service.create(signUpDto);

      expect(result).toEqual(signUpDto);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: signUpDto.email } });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        name: signUpDto.name,
        email: signUpDto.email,
        city: 'Cairo',
        latitude: signUpDto.latitude,
        longitude: signUpDto.longitude,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(signUpDto as User);
    });

    it('should throw a BadRequestException if email already exists', async () => {
      const signUpDto: SignUpDto = {
        name: 'Aly',
        email: 'aly@gmail.com',
        latitude: 30.033333,
        longitude: 31.233334,
      };

      mockUserRepository.findOne.mockResolvedValue(signUpDto);

      await expect(service.create(signUpDto)).rejects.toThrow(BadRequestException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: signUpDto.email } });
    });

    it('should throw a BadRequestException if user is not in Egypt', async () => {
      const signUpDto: SignUpDto = {
        name: 'Aly Qamar',
        email: 'aly@gmail.com',
        latitude: 51.5074,
        longitude: -0.1278,
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockGeocoder.reverse.mockResolvedValue([{ city: 'London', country: 'United Kingdom' }]);

      await expect(service.create(signUpDto)).rejects.toThrow(BadRequestException);
      expect(mockGeocoder.reverse).toHaveBeenCalledWith({ lat: signUpDto.latitude, lon: signUpDto.longitude });
    });
  });
});
