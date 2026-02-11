import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator'
import { UserRole } from '../../../common/enums/role.enum'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 120)
  nombre?: string

  @IsOptional()
  @IsString()
  @Length(2, 120)
  apellido1?: string

  @IsOptional()
  @IsString()
  @Length(0, 120)
  apellido2?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole
}
