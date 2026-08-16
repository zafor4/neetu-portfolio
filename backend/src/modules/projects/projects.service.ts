import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.prisma.project.deleteMany();
    await this.prisma.project.createMany({
      data: [
        {
          title: 'Tech Meet',
          type: 'website',
          image: '/assets/snippit.png',
          description: 'Automated recruitment platform using the M-Smart hybrid AI matching model for candidate profiling, ranking, and shortlisting.',
          technologies: ['Next.js', 'Express.js', 'FastAPI', 'Python', 'AI'],
          github: 'https://github.com/zafor4/tech-meet',
          live: 'https://portfolio-client-five-ebon.vercel.app',
          sortOrder: 1,
        },
        {
          title: 'Bhubanmajhi',
          type: 'website',
          image: '/assets/zentra.png',
          description: 'Full-stack travel booking platform covering tour, hotel, flight, and reservation workflows; integrated SSLCommerz payment and booking management.',
          technologies: ['Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'SSLCommerz'],
          github: 'https://github.com/zafor4/bhubanmajhi',
          live: '',
          sortOrder: 2,
        },
        {
          title: 'Surveillance & Mapping System',
          type: 'website',
          image: '/assets/autovion.png',
          description: 'Real-time surveillance and mapping system supporting live tracking, ride-sharing, and delivery workflows.',
          technologies: ['React Native', 'React.js', 'Node.js', 'WebSockets', 'MapLibre'],
          github: 'https://github.com/zafor4/surveillance-system',
          live: '',
          sortOrder: 3,
        },
        {
          title: 'eFamily Court Judiciary Platform',
          type: 'website',
          image: '/assets/smartchain.png',
          description: 'Digital paperless judiciary platform developed at CSE Tech for judicial user interface workflows and API integration.',
          technologies: ['Next.js', 'React.js', 'NestJS', 'Prisma', 'PostgreSQL'],
          github: '',
          live: '',
          sortOrder: 4,
        },
      ],
    });
  }

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(data: any) {
    return this.prisma.project.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
