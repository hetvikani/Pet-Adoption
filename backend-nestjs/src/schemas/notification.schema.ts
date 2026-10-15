import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  recipient: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({
    enum: ['application_submitted', 'application_approved', 'application_rejected', 'system'],
    default: 'system',
  })
  type: string;

  @Prop({ default: false })
  read: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Application' })
  relatedApplication: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pet' })
  relatedPet: Types.ObjectId;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
