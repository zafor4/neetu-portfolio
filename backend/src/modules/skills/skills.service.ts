import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SkillsService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.prisma.skill.deleteMany();
    await this.prisma.skill.createMany({
      data: [
        { name: 'C++', category: 'Programming & CS', icon: 'Code2', bg: 'bg-[#00599C]', color: 'text-white', sortOrder: 1 },
        { name: 'Python', category: 'Programming & AI', icon: 'Terminal', bg: 'bg-[#3776ab]', color: 'text-white', sortOrder: 2 },
        { name: 'JavaScript & TS', category: 'Programming & Web', icon: 'Code2', bg: 'bg-[#f7df1e]', color: 'text-black', sortOrder: 3 },
        { name: 'React.js & Next.js', category: 'Frontend Engineering', icon: 'Layout', bg: 'bg-[#61dafb]', color: 'text-black', sortOrder: 4 },
        { name: 'NestJS & Node.js', category: 'Backend Engineering', icon: 'Server', bg: 'bg-[#E0234E]', color: 'text-white', sortOrder: 5 },
        { name: 'PostgreSQL & MySQL', category: 'Database Systems', icon: 'Database', bg: 'bg-[#4169E1]', color: 'text-white', sortOrder: 6 },
        { name: 'MongoDB', category: 'NoSQL Databases', icon: 'Database', bg: 'bg-[#47a248]', color: 'text-white', sortOrder: 7 },
        { name: 'Prisma ORM', category: 'Database ORM', icon: 'Layers', bg: 'bg-[#2D3748]', color: 'text-white', sortOrder: 8 },
        { name: 'Machine Learning & Deep Learning', category: 'AI & Research', icon: 'Cpu', bg: 'bg-[#ff007f]', color: 'text-white', sortOrder: 9 },
        { name: 'Data Structures & Algorithms', category: 'CS Fundamentals', icon: 'Cpu', bg: 'bg-foreground', color: 'text-background', sortOrder: 10 },
        { name: 'Docker & Git', category: 'Tools & DevOps', icon: 'GitBranch', bg: 'bg-[#2496ED]', color: 'text-white', sortOrder: 11 },
        { name: 'Tailwind CSS', category: 'Styling Framework', icon: 'Layout', bg: 'bg-[#38bdf8]', color: 'text-white', sortOrder: 12 },
        { name: 'WebSockets & MapLibre', category: 'Real-time & Maps', icon: 'Cloud', bg: 'bg-[#ff9900]', color: 'text-black', sortOrder: 13 },
      ],
    });
  }

  async findAll() {
    return this.prisma.skill.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(data: any) {
    return this.prisma.skill.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.skill.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.skill.delete({
      where: { id },
    });
  }
}
