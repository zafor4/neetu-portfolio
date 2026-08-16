import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const contact = await this.prisma.contact.findFirst();
    const data = {
      location: 'DHAKA, BANGLADESH',
      email: 'adinahawaldar895@gmail.com',
      linkedin: 'https://linkedin.com/in/adina-hawaldar-17az6',
      github: 'https://github.com/adinahawaldar',
      figma: 'https://figma.com/@adinahawaldar',
      twitter: 'https://twitter.com/@adina_hawaldar',
      githubUsername: 'adinahawaldar',
      officeImageUrl: '/assets/professional_office.png',
    };

    if (contact) {
      await this.prisma.contact.update({
        where: { id: contact.id },
        data,
      });
    } else {
      await this.prisma.contact.create({ data });
    }
  }

  async getContact() {
    return this.prisma.contact.findFirst();
  }

  async updateContact(data: any) {
    const contact = await this.getContact();

    if (data.github && typeof data.github === 'string') {
      try {
        const cleanUrl = data.github.trim().replace(/\/+$/, '');
        const parts = cleanUrl.split('/');
        const derivedUsername = parts[parts.length - 1];
        if (derivedUsername && derivedUsername !== 'github.com') {
          data.githubUsername = derivedUsername;
        }
      } catch (e) {
        console.warn('Could not derive GitHub username from:', data.github);
      }
    }

    if (contact) {
      return this.prisma.contact.update({
        where: { id: contact.id },
        data,
      });
    }
    return this.prisma.contact.create({ data });
  }
}
