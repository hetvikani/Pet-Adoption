import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { UserSchema } from './schemas/user.schema';
import { PetSchema } from './schemas/pet.schema';
import { ApplicationSchema } from './schemas/application.schema';
import { NotificationSchema } from './schemas/notification.schema';

dotenv.config();

const samplePets = [
  {
    name: 'Bella',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 2,
    gender: 'Female',
    size: 'Large',
    color: 'Golden',
    description:
      'Bella is a sweet, gentle golden retriever who loves playing fetch and cuddles on rainy afternoons. Fully house-trained and great with kids.',
    photos: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    adoptionFee: 15000,
    healthStatus: { vaccinated: true, neutered: true, specialNeeds: 'None' },
    location: 'Ahmedabad',
  },
  {
    name: 'Milo',
    species: 'Cat',
    breed: 'British Shorthair',
    age: 1.5,
    gender: 'Male',
    size: 'Medium',
    color: 'Silver Grey',
    description:
      'Milo is a calm, independent boy who enjoys napping in sunny spots and chasing feather toys. Calm presence for working professionals.',
    photos: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    adoptionFee: 9000,
    healthStatus: { vaccinated: true, neutered: true, specialNeeds: 'None' },
    location: 'Rajkot',
  },
  {
    name: 'Luna',
    species: 'Dog',
    breed: 'Siberian Husky',
    age: 3,
    gender: 'Female',
    size: 'Large',
    color: 'White & Grey',
    description:
      'Energetic and vocal! Luna loves hiking and requires an active family with an outdoor space. Excellent companion for runners.',
    photos: [
      'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    adoptionFee: 20000,
    healthStatus: { vaccinated: true, neutered: true, specialNeeds: 'High energy exercise needed' },
    location: 'surat',
  },
  {
    name: 'Charlie',
    species: 'Dog',
    breed: 'Beagle',
    age: 4,
    gender: 'Male',
    size: 'Medium',
    color: 'Tricolor',
    description:
      'Charlie has a fantastic nose and a warm heart. Loves sniffing every flower in the park and curls up politely in his dog bed at night.',
    photos: [
      'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    adoptionFee: 12000,
    healthStatus: { vaccinated: true, neutered: true, specialNeeds: 'None' },
    location: 'Junagadh',
  },
  {
    name: 'Oliver',
    species: 'Cat',
    breed: 'Maine Coon',
    age: 2.5,
    gender: 'Male',
    size: 'Large',
    color: 'Brown Tabby',
    description:
      'A gentle giant with luxurious fur and playful curiosity. Loves being brushed and talks with friendly chirps.',
    photos: [
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    adoptionFee: 11000,
    healthStatus: { vaccinated: true, neutered: true, specialNeeds: 'Regular brushing' },
    location: 'Navsari',
  },
  {
    name: 'Daisy',
    species: 'Rabbit',
    breed: 'Holland Lop',
    age: 1,
    gender: 'Female',
    size: 'Small',
    color: 'Caramel & White',
    description:
      'Daisy is a friendly bunny who loves eating fresh hay, cilantro treats, and doing little binkies around the living room.',
    photos: [
      'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    adoptionFee: 5000,
    healthStatus: { vaccinated: true, neutered: true, specialNeeds: 'Indoor rabbit housing' },
    location: 'Jamnagar',
  },
  {
    name: 'Rocky',
    species: 'Dog',
    breed: 'German Shepherd',
    age: 5,
    gender: 'Male',
    size: 'Extra Large',
    color: 'Black & Tan',
    description:
      'Highly intelligent, protective, and obedient. Rocky knows basic and advanced agility commands and is loyal to the core.',
    photos: [
      'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    adoptionFee: 18000,
    healthStatus: { vaccinated: true, neutered: true, specialNeeds: 'None' },
    location: 'Junagadh',
  },
  {
    name: 'Kiwi',
    species: 'Bird',
    breed: 'Cockatiel',
    age: 1,
    gender: 'Male',
    size: 'Small',
    color: 'Yellow & Grey',
    description:
      'Kiwi whistles cheerful tunes and loves perching on shoulders while you read or work. Very social and affectionate companion.',
    photos: [
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    adoptionFee: 6000,
    healthStatus: { vaccinated: true, neutered: false, specialNeeds: 'Bird-safe room' },
    location: 'Morbi',
  },
  {
    name: 'Coco',
    species: 'Dog',
    breed: 'Poodle Mix',
    age: 0.8,
    gender: 'Female',
    size: 'Small',
    color: 'Apricot',
    description:
      'A bouncy, hypoallergenic puppy looking for an attentive family ready for training and lots of affection.',
    photos: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
    adoptionFee: 22000,
    healthStatus: { vaccinated: true, neutered: true, specialNeeds: 'Puppy training recommended' },
    location: 'Vadodara',
  },
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pet_adoption';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB...');

    const UserModel = mongoose.model('User', UserSchema);
    const PetModel = mongoose.model('Pet', PetSchema);
    const ApplicationModel = mongoose.model('Application', ApplicationSchema);
    const NotificationModel = mongoose.model('Notification', NotificationSchema);

    // Clear existing collections
    await UserModel.deleteMany({});
    await PetModel.deleteMany({});
    await ApplicationModel.deleteMany({});
    await NotificationModel.deleteMany({});
    console.log('[Seed] Cleared existing data.');

    // 1. Create Default Admin
    const admin = await UserModel.create({
      name: 'System Admin',
      email: 'admin@gmail.com',
      password: 'AdminPassword123!',
      role: 'admin',
      phone: '+01 90192834',
      address: 'Nehru Nagar, Ahmedabad',
    });

    // 2. Create Sample Regular User
    const user = await UserModel.create({
      name: 'Het Vikani',
      email: 'het@gmail.com',
      password: 'UserPassword123!',
      role: 'user',
      phone: '+91 83921138',
      address: '150 Feet Ring Road, Rajkot',
    });

    console.log(`[Seed] Created Admin: ${admin.email} / AdminPassword123!`);
    console.log(`[Seed] Created User:  ${user.email} / UserPassword123!`);

    // 3. Seed Pets
    const createdPets = await PetModel.insertMany(samplePets);
    console.log(`[Seed] Inserted ${createdPets.length} pets.`);

    // 4. Create one initial application for Het Vikani on Bella
    const sampleApplication = await ApplicationModel.create({
      pet: createdPets[0]._id,
      applicant: user._id,
      fullName: 'Het Vikani',
      email: 'het@gmail.com',
      phone: '+91 83921138',
      address: '150 Feet Ring Road, Rajkot',
      housingType: 'House',
      hasFencedYard: true,
      hasOtherPets: false,
      priorPetExperience: 'Grew up with Golden Retrievers for over 10 years',
      reasonForAdopting: 'Looking for a loving dog companion for daily walks and outdoor adventures.',
      status: 'pending',
    });

    // 5. Create notification for Jane
    await NotificationModel.create({
      recipient: user._id,
      title: 'Application Submitted',
      message: `Your application to adopt ${createdPets[0].name} has been received and is under review.`,
      type: 'application_submitted',
      relatedApplication: sampleApplication._id,
      relatedPet: createdPets[0]._id,
    });

    console.log('[Seed] Successfully seeded initial application and notification.');
    console.log('[Seed] Database initialization complete!');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
