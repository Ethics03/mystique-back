import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile, Role, Status } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-roles.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import {
  CreateProfileDto,
  RejectProfileDto,
  UpdateProfileDto,
} from './dto/profile.dto';

interface ProfileWithUser extends Profile {
  user: {
    userId: string;
    email: string;
    name: string;
    role: string;
  };
}

interface UserPayload {
  userId: string;
  email: string;
  role: Role;
}

interface ProfileResponse {
  message: string;
  profile: Profile;
}

@Controller('profile')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  //creating profile -> (only cl/prnc)

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CL, Role.PRNC)
  async createProfile(
    @CurrentUser() user: UserPayload,
    @Body() body: CreateProfileDto,
  ): Promise<ProfileResponse> {
    const profile = await this.profileService.createProfile(user.userId, body);
    return { message: 'Profile created successfully', profile };
  }

  //getting own profile
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@CurrentUser() user: UserPayload): Promise<any> {
    return this.profileService.getMyProfile(user.userId);
  }

  //updating profile
  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CL, Role.PRNC)
  async updateProfile(
    @CurrentUser() user: UserPayload,
    @Body() body: UpdateProfileDto,
  ): Promise<ProfileResponse> {
    const profile = await this.profileService.updateProfile(user.userId, body);
    return { message: 'profile updated successfully', profile };
  }

  //getting all profiles in filters
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllProfiles(
    @Query('status') status?: Status,
    @Query('search') search?: string,
  ): Promise<ProfileWithUser[]> {
    return this.profileService.getAllProfiles({ status, search });
  }

  //getting profile by id
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getProfileById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Profile> {
    return this.profileService.getProfileById(id);
  }

  //approve profile
  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async approveProfile(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProfileResponse> {
    const profile = await this.profileService.approveProfile(id);
    return { message: 'profile successfully approved', profile };
  }

  //reject profile
  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async rejectProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: RejectProfileDto,
  ): Promise<ProfileResponse> {
    const profile = await this.profileService.rejectProfile(
      id,
      body.rejectionReason,
    );
    return { message: 'profile successfully rejected', profile };
  }
}
