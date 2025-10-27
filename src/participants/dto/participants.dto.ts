import { IsOptional, MaxLength } from '@nestjs/class-validator';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateParticipantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  collegeName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  contact: string;

  @IsString()
  @IsNotEmpty()
  aadhaarFileUrl: string;

  @IsString()
  @IsNotEmpty()
  idFileUrl: string;

  @IsString()
  @IsNotEmpty()
  eventId: string;
}

export class UpdateParticipantDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  collegeName?: string;

  @IsEmail()
  email?: string;

  @IsString()
  @IsNotEmpty()
  contact?: string;

  @IsString()
  @IsNotEmpty()
  aadhaarFileUrl?: string;

  @IsString()
  @IsNotEmpty()
  idFileUrl?: string;
}

export class RejectParticipantDto {
  @IsString()
  @IsOptional()
  @MaxLength(500)
  rejectionReason?: string;
}
