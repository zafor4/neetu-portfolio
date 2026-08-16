import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { Contact } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  getContact(): Promise<Contact> {
    return this.contactService.getContact();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateContact(@Body() body: Partial<Contact>): Promise<Contact> {
    return this.contactService.updateContact(body);
  }
}
