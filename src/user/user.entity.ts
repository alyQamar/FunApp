import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    @ApiProperty({
        description: 'The unique identifier for the user',
        example: 1,
    })
    id: number;

    @Column()
    @ApiProperty({
        description: 'The name of the user',
        example: 'Aly Qamar',
    })
    name: string;

    @Column({ unique: true })
    @ApiProperty({
        description: 'The email address of the user',
        example: 'alyqamar@gmail.com',
    })
    email: string;

    @Column()
    @ApiProperty({
        description: 'The city where the user is located',
        example: 'Cairo',
    })
    city: string;

    @Column('decimal', { precision: 10, scale: 7, nullable: true })
    @ApiProperty({
        description: 'The latitude coordinate of the user location',
        example: 30.033333,
        type: 'number',
        format: 'float',
    })
    latitude: number;

    @Column('decimal', { precision: 10, scale: 7, nullable: true })
    @ApiProperty({
        description: 'The longitude coordinate of the user location',
        example: 31.233334,
        type: 'number',
        format: 'float',
    })
    longitude: number;
}
