import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const profile = await this.prisma.profile.findFirst();
    const data = {
      name: 'MD ZAFOR IQBAL',
      title: 'Software Engineer & Programming Instructor',
      location: 'Dhaka, Bangladesh',
      statement: '[Computer Science and Engineering graduate (CGPA 3.80/4.00) and M.Sc. candidate with professional software engineering experience, published research in Deep Learning & AI, and hands-on teaching experience in React.js and modern Web Development.]',
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
