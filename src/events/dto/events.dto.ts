import { IsString, IsInt, Min, IsBoolean, IsOptional } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  minTeamSize: number;

  @IsInt()
  @Min(1)
  maxTeamSize: number;

  @IsInt()
  @Min(1)
  maxSlots: number;
}

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  minTeamSize?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxTeamSize?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxSlots?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  filledSlots?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isLocked?: boolean;
}
