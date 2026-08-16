import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { SkillsModule } from './modules/skills/skills.module';
import { ContactModule } from './modules/contact/contact.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { MinioModule } from './modules/minio/minio.module';
import { GithubModule } from './modules/github/github.module';
import { PublicationsModule } from './modules/publications/publications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProfileModule,
    ProjectsModule,
    ExperienceModule,
    SkillsModule,
    ContactModule,
    MinioModule,
    GithubModule,
    PublicationsModule,
    PortfolioModule,
  ],
})
export class AppModule {}
