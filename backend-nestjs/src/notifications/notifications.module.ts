import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsController } from './notifications.controller';
import { Notification, NotificationSchema } from '../schemas/notification.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    AuthModule,
  ],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
