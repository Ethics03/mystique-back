// src/auth/dto/validate-token.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { RegistrationType } from '@prisma/client';

export class ValidateTokenDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;

  @IsOptional()
  @IsEnum(RegistrationType)
  registration_type?: RegistrationType;
}

