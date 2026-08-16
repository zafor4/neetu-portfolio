import { Controller, Get, Post, Delete, Param, Body, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from '../profile/profile.service';
import { ProjectsService } from '../projects/projects.service';
import { ExperienceService } from '../experience/experience.service';
import { SkillsService } from '../skills/skills.service';
import { ContactService } from '../contact/contact.service';
import { MinioService } from '../minio/minio.service';
import { PublicationsService } from '../publications/publications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class PortfolioController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly projectsService: ProjectsService,
    private readonly expService: ExperienceService,
    private readonly skillsService: SkillsService,
    private readonly contactService: ContactService,
    private readonly minioService: MinioService,
    private readonly publicationsService: PublicationsService,
  ) {}

  @Get('portfolio')
  async getPortfolioData() {
    const [profile, projects, experiences, skills, contact, publications] = await Promise.all([
      this.profileService.getProfile(),
      this.projectsService.findAll(),
      this.expService.findAll(),
      this.skillsService.findAll(),
      this.contactService.getContact(),
      this.publicationsService.findAll(),
    ]);

    return {
      profile,
      projects,
      experiences,
      skills,
      contact,
      publications,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/media')
  async getMediaFiles() {
    return this.minioService.listFiles();
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(@UploadedFile() file: Express.Multer.File, @Body('folder') folder?: string) {
    const targetFolder = folder && folder.trim() ? folder.trim() : 'images';
    const result = await this.minioService.uploadFile(file, targetFolder);
    return typeof result === 'string' ? { url: result } : result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/media/*')
  async deleteMedia(@Param('0') key: string) {
    await this.minioService.deleteFile(key);
    return { success: true, key };
  }
}
