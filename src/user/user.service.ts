import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { GetUserDto } from './dto/get-user.dto';
import { SignUpDto } from './dto/sign-up.dto';
import * as NodeGeocoder from 'node-geocoder';

@Injectable()
export class UserService {
  private geocoder: NodeGeocoder.Geocoder;

  /**
   * Constructs a new instance of the UserService.
   * 
   * @param userRepository - The repository to interact with user data.
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const geocoderOptions: NodeGeocoder.Options = {
      provider: 'locationiq',
      apiKey: process.env.LOCATIONIQ_API_KEY,
    };
    this.geocoder = NodeGeocoder(geocoderOptions);
  }

  /**
   * Finds a user by their ID.
   * 
   * @param userId - The ID of the user to retrieve.
   * @returns A promise that resolves to a GetUserDto or undefined if the user is not found.
   * @throws NotFoundException if the user does not exist.
   */
  async findOne(userId: string): Promise<GetUserDto | undefined> {
    const user = await this.userRepository.findOne({ where: { id: Number(userId) } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Creates a new user in the system.
   * 
   * @param signUpDto - The data transfer object containing the user's sign-up details.
   * @returns A promise that resolves to the newly created User entity.
   * @throws BadRequestException if the email already exists or the user is not in Egypt.
   */
  async create(signUpDto: SignUpDto): Promise<User> {
    const { name, email, latitude, longitude } = signUpDto;

    const emailExists = await this.userRepository.findOne({ where: { email } });
    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }

    const location = await this.reverseGeocode(latitude, longitude);

    if (location.country !== 'Egypt') {
      throw new BadRequestException('Sign-ups are only allowed from within Egypt');
    }

    const newUser = this.userRepository.create({
      name,
      email,
      city: location.city,
      latitude,
      longitude,
    });

    return this.userRepository.save(newUser);
  }

  /**
   * Performs reverse geocoding to obtain the city and country from latitude and longitude.
   * 
   * @param latitude - The latitude of the location.
   * @param longitude - The longitude of the location.
   * @returns A promise that resolves to an object containing the city and country.
   * @throws BadRequestException if no location is found or if an error occurs during geocoding.
   */
  private async reverseGeocode(latitude: number, longitude: number): Promise<{ city: string, country: string }> {
    try {
      const res = await this.geocoder.reverse({ lat: latitude, lon: longitude });
      if (res.length === 0) {
        throw new BadRequestException('No location found');
      }

      return {
        city: res[0].city,
        country: res[0].country,
      };
    } catch (err) {
      console.error('Geocoding error:', err);
      throw new BadRequestException('Could not reverse geocode location');
    }
  }
}
