import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { Application, ApplicationSchema } from '../schemas/application.schema';
import { Pet, PetSchema } from '../schemas/pet.schema';
import { Notification, NotificationSchema } from '../schemas/notification.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
      { name: Pet.name, schema: PetSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    AuthModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
