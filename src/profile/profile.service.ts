import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../auth/prisma.service';
import { Profile, Status } from '@prisma/client';

interface ProfileFilters {
  status?: Status;
  search?: string;
}

interface ProfileWithUser extends Profile {
  user: {
    userId: string;
    email: string;
    name: string;
    role: string;
  };
}

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(
    userId: string,
    data: {
      contact: string;
      aadhaarFileUrl: string;
      collegeIdUrl: string;
      collegeName: string;
    },
  ): Promise<Profile> {
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new BadRequestException('Profile already exists');
    }

    return await this.prisma.profile.create({
      data: {
        userId,
        contact: data.contact,
        aadhaarFileUrl: data.aadhaarFileUrl,
        collegeIdUrl: data.collegeIdUrl,
        collegeName: data.collegeName,
        status: Status.PENDING,
      },
    });
  }

  //getting the profile
  async getMyProfile(userId: string): Promise<Profile> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            userId: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async updateProfile(
    userId: string,
    data: {
      contact?: string;
      aadhaarFileUrl?: string;
      collegeIdUrl?: string;
      collegeName?: string;
    },
  ): Promise<Profile> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('profile not found');
    }

    if (profile.status !== Status.REJECTED) {
      throw new ForbiddenException('can only update rejected profiles');
    }

    return this.prisma.profile.update({
      where: { userId },
      data: {
        ...data,
        status: Status.PENDING,
      },
    });
  }

  //admin access to profile
  async getAllProfiles(filters?: ProfileFilters): Promise<ProfileWithUser[]> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { collegeName: { contains: filters.search, mode: 'insensitive' } },
        { contact: { contains: filters.search } },
        { user: { email: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    return (await this.prisma.profile.findMany({
      where,
      include: {
        user: {
          select: {
            userId: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })) as ProfileWithUser[];
  }

  // admin -> approving profiles and access
  async approveProfile(profileId: number): Promise<Profile> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new NotFoundException('profile not found');
    }

    if (profile.status === Status.APPROVED) {
      throw new BadRequestException('profile already approved');
    }

    return await this.prisma.profile.update({
      where: { id: profileId },
      data: {
        status: Status.APPROVED,
      },
    });
  }

  //rejecting profile
  async rejectProfile(profileId: number): Promise<Profile> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new NotFoundException('profile not found');
    }

    if (profile.status === Status.REJECTED) {
      throw new BadRequestException('profile already rejected');
    }

    return await this.prisma.profile.update({
      where: { id: profileId },
      data: {
        status: Status.REJECTED,
      },
    });
  }

  //get profile by id -> important for the rejecting and approving
  async getProfileById(profileId: number): Promise<ProfileWithUser> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        user: {
          select: {
            userId: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('profile does not exist');
    }

    return profile as ProfileWithUser;
  }
}
