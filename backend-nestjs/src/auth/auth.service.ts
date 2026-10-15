import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../schemas/user.schema';
import { RegisterDto, LoginDto, UpdateProfileDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password, phone, address, role, adminSecret } = registerDto;

    const existingUser = await this.userModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new BadRequestException('An account with this email already exists');
    }

    let assignedRole = 'user';
    if (role === 'admin' && adminSecret === process.env.ADMIN_INVITE_KEY) {
      assignedRole = 'admin';
    }

    const user = await this.userModel.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      address: address || '',
      role: assignedRole,
    });

    const token = this.jwtService.sign({ id: user._id });

    return {
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ id: user._id });

    return {
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        createdAt: (user as any).createdAt,
      },
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateProfileDto.name) user.name = updateProfileDto.name;
    if (updateProfileDto.phone !== undefined) user.phone = updateProfileDto.phone;
    if (updateProfileDto.address !== undefined) user.address = updateProfileDto.address;

    await user.save();

    return {
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    };
  }
}
