import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExperienceService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.prisma.experience.deleteMany();
    await this.prisma.experience.createMany({
      data: [
        {
          company: 'CSE Tech',
          role: 'Software Engineer (Frontend)',
          duration: '01/2026 – Present',
          desc: 'Develop enterprise web applications using Next.js, React.js, NestJS, and PostgreSQL. Rebuilt company portfolio and digital paperless judiciary platform eFamily Court. Guide junior developers and interns.',
          sortOrder: 1,
        },
        {
          company: 'Fawz Biz Enterprises',
          role: 'Full Stack Developer & Database Specialist',
          duration: '02/2026 – Present',
          desc: 'Design relational & non-relational database structures, SQL queries, Prisma ORM integrations, and RESTful APIs for enterprise software projects.',
          sortOrder: 2,
        },
        {
          company: 'SharpBD IT Solution',
          role: 'Frontend Developer',
          duration: '04/2025 – 09/2025',
          desc: 'Developed real-time surveillance & mapping system using WebSockets & MapLibre, and full-stack travel booking platform.',
          sortOrder: 3,
        },
        {
          company: 'SharpBD IT Solution',
          role: 'React.js Developer (Intern)',
          duration: '01/2025 – 04/2025',
          desc: 'Integrated RESTful APIs using Axios and built responsive user interfaces using Bootstrap and CSS.',
          sortOrder: 4,
        },
      ],
    });
  }

  async findAll() {
    return this.prisma.experience.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(data: any) {
    return this.prisma.experience.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.experience.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.experience.delete({
      where: { id },
    });
  }
}
