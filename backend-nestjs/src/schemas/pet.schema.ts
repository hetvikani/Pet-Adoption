import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PetDocument = Pet & Document;

@Schema({ _id: false })
export class HealthStatus {
  @Prop({ default: true })
  vaccinated: boolean;

  @Prop({ default: true })
  neutered: boolean;

  @Prop({ default: 'None' })
  specialNeeds: string;
}

@Schema({ timestamps: true })
export class Pet {
  @Prop({ required: true, trim: true, maxlength: 40 })
  name: string;

  @Prop({ required: true, trim: true })
  species: string;

  @Prop({ required: true, trim: true })
  breed: string;

  @Prop({ required: true, min: 0, max: 30 })
  age: number;

  @Prop({ enum: ['Male', 'Female', 'Unknown'], default: 'Unknown' })
  gender: string;

  @Prop({ enum: ['Small', 'Medium', 'Large', 'Extra Large'], default: 'Medium' })
  size: string;

  @Prop({ default: '' })
  color: string;

  @Prop({ required: true, maxlength: 1000 })
  description: string;

  @Prop({ type: [String], default: [] })
  photos: string[];

  @Prop({ enum: ['available', 'pending', 'adopted'], default: 'available', index: true })
  status: string;

  @Prop({ default: 0, min: 0 })
  adoptionFee: number;

  @Prop({ type: HealthStatus, default: () => ({ vaccinated: true, neutered: true, specialNeeds: 'None' }) })
  healthStatus: HealthStatus;

  @Prop({ default: 'Main Shelter' })
  location: string;
}

export const PetSchema = SchemaFactory.createForClass(Pet);

PetSchema.index({ name: 'text', breed: 'text', species: 'text' });
PetSchema.index({ species: 1, breed: 1, age: 1, status: 1 });
