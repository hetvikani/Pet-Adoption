import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ApplicationDocument = Application & Document;

@Schema({ timestamps: true })
export class Application {
  @Prop({ type: Types.ObjectId, ref: 'Pet', required: true })
  pet: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  applicant: Types.ObjectId;

  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ enum: ['Apartment', 'House', 'Condo', 'Other'], default: 'Apartment' })
  housingType: string;

  @Prop({ default: false })
  hasFencedYard: boolean;

  @Prop({ default: false })
  hasOtherPets: boolean;

  @Prop({ default: 'Some experience' })
  priorPetExperience: string;

  @Prop({ required: true, maxlength: 800 })
  reasonForAdopting: string;

  @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true })
  status: string;

  @Prop({ default: '' })
  adminNotes: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reviewedBy: Types.ObjectId;

  @Prop({ type: Date })
  reviewedAt: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

ApplicationSchema.index({ pet: 1, applicant: 1, status: 1 });
