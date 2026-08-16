import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(): Promise<Profile> {
    return this.profileService.getProfile();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateProfile(@Body() body: Partial<Profile>): Promise<Profile> {
    return this.profileService.updateProfile(body);
  }
}
