import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';

export class CreateApplicationDto {
  @IsNotEmpty({ message: 'Pet ID is required' })
  @IsString()
  petId: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  housingType?: string;

  @IsOptional()
  @IsBoolean()
  hasFencedYard?: boolean;

  @IsOptional()
  @IsBoolean()
  hasOtherPets?: boolean;

  @IsOptional()
  @IsString()
  priorPetExperience?: string;

  @IsNotEmpty({ message: 'Reason for adopting is required' })
  @IsString()
  reasonForAdopting: string;
}

export class UpdateApplicationStatusDto {
  @IsNotEmpty()
  @IsEnum(['pending', 'approved', 'rejected'], { message: 'Status must be pending, approved, or rejected' })
  status: string;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
