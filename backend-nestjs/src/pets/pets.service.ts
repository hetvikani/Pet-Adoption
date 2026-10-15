import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pet, PetDocument } from '../schemas/pet.schema';
import { Application, ApplicationDocument } from '../schemas/application.schema';
import { CreatePetDto, UpdatePetDto, UpdatePetStatusDto } from './dto/pet.dto';

@Injectable()
export class PetsService {
  constructor(
    @InjectModel(Pet.name) private petModel: Model<PetDocument>,
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
  ) {}

  async findAll(query: any) {
    const {
      search,
      species,
      breed,
      minAge,
      maxAge,
      gender,
      status,
      page = 1,
      limit = 9,
      sortBy = 'createdAt',
      order = 'desc',
    } = query;

    const filter: any = {};

    if (status) {
      if (status !== 'all') {
        filter.status = status;
      }
    } else {
      filter.status = 'available';
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: searchRegex }, { breed: searchRegex }];
    }

    if (species && species !== 'all') {
      filter.species = new RegExp(`^${species}$`, 'i');
    }

    if (breed && breed !== 'all') {
      filter.breed = new RegExp(breed, 'i');
    }

    if (gender && gender !== 'all') {
      filter.gender = gender;
    }

    if (minAge !== undefined || maxAge !== undefined) {
      filter.age = {};
      if (minAge !== undefined && minAge !== '') filter.age.$gte = Number(minAge);
      if (maxAge !== undefined && maxAge !== '') filter.age.$lte = Number(maxAge);
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 9;
    const skip = (pageNum - 1) * limitNum;

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj: any = { [sortBy]: sortOrder };

    const total = await this.petModel.countDocuments(filter);
    const pets = await this.petModel
      .find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const distinctSpecies = await this.petModel.distinct('species');
    const distinctBreeds = await this.petModel.distinct('breed');

    return {
      success: true,
      count: pets.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      filterOptions: {
        species: distinctSpecies,
        breeds: distinctBreeds,
      },
      data: pets,
    };
  }

  async findOne(id: string) {
    const pet = await this.petModel.findById(id);
    if (!pet) {
      throw new NotFoundException('Pet not found');
    }
    return {
      success: true,
      data: pet,
    };
  }

  async create(createPetDto: CreatePetDto) {
    const pet = await this.petModel.create({
      ...createPetDto,
      age: Number(createPetDto.age),
      status: createPetDto.status || 'available',
      adoptionFee: createPetDto.adoptionFee !== undefined ? Number(createPetDto.adoptionFee) : 0,
    });
    return {
      success: true,
      message: 'Pet created successfully',
      data: pet,
    };
  }

  async update(id: string, updatePetDto: UpdatePetDto) {
    const pet = await this.petModel.findByIdAndUpdate(id, updatePetDto, {
      new: true,
      runValidators: true,
    });
    if (!pet) {
      throw new NotFoundException('Pet not found');
    }
    return {
      success: true,
      message: 'Pet updated successfully',
      data: pet,
    };
  }

  async updateStatus(id: string, updatePetStatusDto: UpdatePetStatusDto) {
    const pet = await this.petModel.findByIdAndUpdate(
      id,
      { status: updatePetStatusDto.status },
      { new: true, runValidators: true },
    );
    if (!pet) {
      throw new NotFoundException('Pet not found');
    }
    return {
      success: true,
      message: `Pet status updated to ${updatePetStatusDto.status}`,
      data: pet,
    };
  }

  async remove(id: string) {
    const pet = await this.petModel.findById(id);
    if (!pet) {
      throw new NotFoundException('Pet not found');
    }
    await this.applicationModel.deleteMany({ pet: pet._id });
    await pet.deleteOne();

    return {
      success: true,
      message: 'Pet and associated applications removed successfully',
    };
  }
}
