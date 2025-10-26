import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

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

export class UpdateParticipantDto extends PartialType(CreateParticipantDto) {
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
