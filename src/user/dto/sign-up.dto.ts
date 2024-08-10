import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsDecimal, IsNotEmpty } from 'class-validator';

export class SignUpDto {
    @ApiProperty({ description: 'Name of the user', example: 'Aly Qamar' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Email address of the user', example: 'alyqamareldawla@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'Latitude of the user location', example: 30.0444 })
    @IsDecimal()
    @IsNotEmpty()
    latitude: number;

    @ApiProperty({ description: 'Longitude of the user location', example: 31.2357 })
    @IsDecimal()
    @IsNotEmpty()
    longitude: number;
}
