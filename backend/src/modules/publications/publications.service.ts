import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicationsService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.prisma.publication.deleteMany();
    await this.prisma.publication.createMany({
      data: [
        {
          title: 'Enhanced Agricultural Productivity: Dragon Fruit Leaf Disease Detection Using Deep Learning Models',
          publisher: 'International Conference on Intelligent Data Analysis and Applications (IDAA 2025)',
          year: 'Dec 2025',
          authors: 'MD ZAFOR IQBAL, et al.',
          abstract: 'Published research proposing an automated deep learning framework for accurate identification and classification of dragon fruit leaf diseases to increase agricultural crop yield.',
          doi: '10.1007/IDAA2025',
          link: 'https://github.com/zafor4',
          pdfUrl: '/documents/dragon_fruit_research.pdf',
          tags: ['Deep Learning', 'Computer Vision', 'Agricultural AI', 'Image Classification'],
          sortOrder: 1,
        },
        {
          title: 'M SMART: An Automated Multi Stage Semantic Evaluation Pipeline for Job Candidate Compatibility Assessment in the Tech Industry',
          publisher: 'The International Conference on Recent Progresses in Science, Engineering and Technology (ICRPSET-2026)',
          year: '2026',
          authors: 'MD ZAFOR IQBAL, et al.',
          abstract: 'Submitted research paper introducing an automated AI semantic evaluation pipeline for candidate resume profiling, skill matching, and technical compatibility scoring.',
          doi: '',
          link: '',
          pdfUrl: '/documents/msmart_research.pdf',
          tags: ['NLP', 'Sentence Transformers', 'Semantic Matching', 'AI Recruitment'],
          sortOrder: 2,
        },
      ],
    });
  }

  async findAll() {
    return this.prisma.publication.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(data: any) {
    return this.prisma.publication.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.publication.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.publication.delete({
      where: { id },
    });
  }
}
