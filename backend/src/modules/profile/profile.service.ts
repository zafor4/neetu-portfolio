import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const profile = await this.prisma.profile.findFirst();
    const data = {
      name: 'Humayra Arzooman',
      title: 'UI/UX Designer & Product Designer',
      location: 'Dhaka, Bangladesh',
      statement: '[A product-focused Designer & Founder from Bangladesh, building high-performance digital experiences where modern design meets scalable technology, cloud innovation, and intelligent solutions.]',
      availableForWork: true,
      resumeUrl: '/resume.pdf',
      avatarUrl: '/assets/adina.jpeg',
      showHero: true,
      showProjects: true,
      showExperience: true,
      showSkills: true,
      showGithub: true,
      showPublications: true,
      showActivities: true,
      showContact: true,
    };

    if (profile) {
      await this.prisma.profile.update({
        where: { id: profile.id },
        data,
      });
    } else {
      await this.prisma.profile.create({ data });
    }
  }

  async getProfile() {
    return this.prisma.profile.findFirst();
  }

  async updateProfile(data: any) {
    const profile = await this.getProfile();
    if (profile) {
      return this.prisma.profile.update({
        where: { id: profile.id },
        data,
      });
    }
    return this.prisma.profile.create({ data });
  }
}
