import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'admin@demo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Admin' })
  @IsString()
  @MaxLength(120)
  nombre: string;

  @ApiProperty({ example: 'Demo' })
  @IsString()
  @MaxLength(120)
  apellido1: string;

  @ApiProperty({ example: 'Opcional', required: false })
  @IsString()
  @MaxLength(120)
  @IsOptional()
  apellido2?: string;
}
