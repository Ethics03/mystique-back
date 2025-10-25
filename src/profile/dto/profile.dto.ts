import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  IsOptional,
} from '@nestjs/class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, { message: 'Contact must be 10 digits' })
  contact: string;

  @IsString()
  @IsNotEmpty()
  aadhaarFileUrl: string;

  @IsString()
  @IsNotEmpty()
  collegeIdUrl: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 200)
  collegeName: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Contact must be 10 digits' })
  contact?: string;

  @IsOptional()
  @IsString()
  aadhaarFileUrl?: string;

  @IsOptional()
  @IsString()
  collegeIdUrl?: string;

  @IsOptional()
  @IsString()
  @Length(3, 200)
  collegeName?: string;
}
