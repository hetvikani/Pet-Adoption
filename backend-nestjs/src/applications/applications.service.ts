import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Application, ApplicationDocument } from '../schemas/application.schema';
import { Pet, PetDocument } from '../schemas/pet.schema';
import { Notification, NotificationDocument } from '../schemas/notification.schema';
import { CreateApplicationDto, UpdateApplicationStatusDto } from './dto/application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
    @InjectModel(Pet.name) private petModel: Model<PetDocument>,
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(user: any, createDto: CreateApplicationDto) {
    const {
      petId,
      fullName,
      email,
      phone,
      address,
      housingType,
      hasFencedYard,
      hasOtherPets,
      priorPetExperience,
      reasonForAdopting,
    } = createDto;

    const pet = await this.petModel.findById(petId);
    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    if (pet.status !== 'available') {
      throw new BadRequestException(`This pet is currently ${pet.status} and cannot be applied for.`);
    }

    const existingApp = await this.applicationModel.findOne({
      pet: petId,
      applicant: user._id,
      status: { $in: ['pending', 'approved'] },
    });

    if (existingApp) {
      throw new BadRequestException('You have already submitted an active application for this pet.');
    }

    const application = await this.applicationModel.create({
      pet: new Types.ObjectId(petId),
      applicant: user._id,
      fullName: fullName || user.name,
      email: email || user.email,
      phone: phone || user.phone || '',
      address: address || user.address || '',
      housingType: housingType || 'Apartment',
      hasFencedYard: Boolean(hasFencedYard),
      hasOtherPets: Boolean(hasOtherPets),
      priorPetExperience: priorPetExperience || 'Some experience',
      reasonForAdopting,
      status: 'pending',
    });

    await application.populate('pet', 'name species breed photos status');

    await this.notificationModel.create({
      recipient: user._id,
      title: 'Adoption Application Submitted',
      message: `Your application to adopt ${pet.name} has been received and is pending shelter review.`,
      type: 'application_submitted',
      relatedApplication: application._id,
      relatedPet: pet._id,
    });

    return {
      success: true,
      message: 'Application submitted successfully',
      data: application,
    };
  }

  async getMyApplications(userId: string) {
    const applications = await this.applicationModel
      .find({ applicant: userId })
      .populate('pet')
      .sort({ createdAt: -1 });

    return {
      success: true,
      count: applications.length,
      data: applications,
    };
  }

  async getAllApplications(query: any) {
    const { status, petId } = query;
    const filter: any = {};

    if (status && status !== 'all') {
      filter.status = status;
    }
    if (petId) {
      filter.pet = petId;
    }

    const applications = await this.applicationModel
      .find(filter)
      .populate('pet')
      .populate('applicant', 'name email phone')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    return {
      success: true,
      count: applications.length,
      data: applications,
    };
  }

  async updateStatus(id: string, reviewerId: string, updateDto: UpdateApplicationStatusDto) {
    const { status, adminNotes } = updateDto;

    const application = await this.applicationModel.findById(id).populate('pet');
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const petId = (application.pet as any)._id;
    const petName = (application.pet as any).name;
    const previousStatus = application.status;

    application.status = status;
    if (adminNotes !== undefined) application.adminNotes = adminNotes;
    application.reviewedBy = new Types.ObjectId(reviewerId);
    application.reviewedAt = new Date();

    await application.save();

    if (status === 'approved') {
      await this.petModel.findByIdAndUpdate(petId, { status: 'adopted' });

      await this.applicationModel.updateMany(
        {
          pet: petId,
          _id: { $ne: application._id },
          status: 'pending',
        },
        {
          status: 'rejected',
          adminNotes: 'Another applicant was approved for this pet.',
        },
      );

      await this.notificationModel.create({
        recipient: application.applicant,
        title: '🎉 Application Approved!',
        message: `Congratulations! Your adoption application for ${petName} has been approved. The shelter will contact you soon.`,
        type: 'application_approved',
        relatedApplication: application._id,
        relatedPet: petId,
      });
    } else if (status === 'rejected') {
      if (previousStatus === 'approved') {
        const otherApproved = await this.applicationModel.findOne({
          pet: petId,
          status: 'approved',
        });
        if (!otherApproved) {
          await this.petModel.findByIdAndUpdate(petId, { status: 'available' });
        }
      }

      await this.notificationModel.create({
        recipient: application.applicant,
        title: 'Application Status Update',
        message: `Your application for ${petName} was not approved at this time. Notes: ${adminNotes || 'No additional notes'}`,
        type: 'application_rejected',
        relatedApplication: application._id,
        relatedPet: petId,
      });
    }

    const updatedApp = await this.applicationModel
      .findById(id)
      .populate('pet')
      .populate('applicant', 'name email phone')
      .populate('reviewedBy', 'name email');

    return {
      success: true,
      message: `Application marked as ${status}`,
      data: updatedApp,
    };
  }
}
