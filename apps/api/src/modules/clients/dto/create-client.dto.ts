import { IsString, IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ClientType {
  PERSON = 'PERSON',
  COMPANY = 'COMPANY',
}

export class CreateClientDto {
  @ApiProperty({ enum: ClientType, example: ClientType.PERSON })
  @IsEnum(ClientType)
  type: ClientType;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '123 Main St, City, Country' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Important client notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
