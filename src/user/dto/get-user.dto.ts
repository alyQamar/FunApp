import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto {
    @ApiProperty({ description: 'Unique identifier for the user', example: 1 })
    id: number;

    @ApiProperty({ description: 'Name of the user', example: 'Aly Qamar' })
    name: string;

    @ApiProperty({ description: 'Email address of the user', example: 'alyqamareldawla@gmail.com' })
    email: string;

    @ApiProperty({ description: 'City where the user live', example: 'Cairo' })
    city: string;
}
