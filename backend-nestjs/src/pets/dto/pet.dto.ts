import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, IsEnum, Min } from 'class-validator';

export class CreatePetDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Species is required' })
  @IsString()
  species: string;

  @IsNotEmpty({ message: 'Breed is required' })
  @IsString()
  breed: string;

  @IsNotEmpty({ message: 'Age is required' })
  @IsNumber()
  @Min(0)
  age: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  photos?: string[];

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  adoptionFee?: number;

  @IsOptional()
  healthStatus?: {
    vaccinated?: boolean;
    neutered?: boolean;
    specialNeeds?: string;
  };

  @IsOptional()
  @IsString()
  location?: string;
}

export class UpdatePetDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  species?: string;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  photos?: string[];

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  adoptionFee?: number;

  @IsOptional()
  healthStatus?: {
    vaccinated?: boolean;
    neutered?: boolean;
    specialNeeds?: string;
  };

  @IsOptional()
  @IsString()
  location?: string;
}

export class UpdatePetStatusDto {
  @IsNotEmpty()
  @IsEnum(['available', 'pending', 'adopted'], { message: 'Status must be available, pending, or adopted' })
  status: string;
}
