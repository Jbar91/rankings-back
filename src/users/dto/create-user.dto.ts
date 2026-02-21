import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEnum,
} from 'class-validator'
import { UserRole } from '../entities/user.entity'

export class CreateUserDto {
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsString()
  phone: string

  @IsOptional()
  @IsNumber()
  ranking?: number

  @IsOptional()
  @IsBoolean()
  isStudent?: boolean

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole
}
