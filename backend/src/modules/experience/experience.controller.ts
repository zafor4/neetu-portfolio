import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('experiences')
export class ExperienceController {
  constructor(private readonly expService: ExperienceService) {}

  @Get()
  async findAll() {
    return this.expService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: any) {
    return this.expService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.expService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.expService.remove(id);
  }
}
