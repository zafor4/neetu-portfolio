import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivitiesService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.prisma.activity.deleteMany();
    await this.prisma.activity.createMany({
      data: [
        {
          title: 'React.js Course Instructor',
          category: 'Teaching & Instruction',
          organization: 'NCSA-EDGE Project Training Program (BCC & ICT Division) | Daffodil International University',
          date: '05/2026 – 06/2026',
          description: 'Instructed the "SPA Development with React.js" course for 25+ learners through hands-on coding sessions, state management, REST API integration, and deployment practices.',
          image: '/assets/professional_office.png',
          link: 'https://github.com/zafor4',
          sortOrder: 1,
        },
        {
          title: 'M.Sc. in Computer Science & Engineering',
          category: 'Education & Academics',
          organization: 'Daffodil International University, Dhaka',
          date: '05/2026 – Present',
          description: 'Advanced graduate studies focused on Data Mining, Machine Learning, and Distributed Software Architectures.',
          image: '/assets/autovion.png',
          link: '',
          sortOrder: 2,
        },
        {
          title: 'B.Sc. in Computer Science & Engineering (CGPA: 3.80/4.00)',
          category: 'Education & Academics',
          organization: 'Daffodil International University, Dhaka',
          date: '01/2022 – 12/2025',
          description: 'Graduated with high distinction (CGPA 3.80/4.00). Specialized in Software Engineering, Algorithms, and Machine Learning.',
          image: '/assets/zentra.png',
          link: '',
          sortOrder: 3,
        },
      ],
    });
  }

  async findAll() {
    return this.prisma.activity.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(data: any) {
    return this.prisma.activity.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.activity.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.activity.delete({
      where: { id },
    });
  }
}
