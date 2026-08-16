import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  async findAll() {
    return this.skillsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: any) {
    return this.skillsService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.skillsService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.skillsService.remove(id);
  }
}
