import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Get()
  async findAll() {
    return this.publicationsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: any) {
    return this.publicationsService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.publicationsService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.publicationsService.remove(id);
  }
}
