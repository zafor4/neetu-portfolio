import { Injectable, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    const count = await this.prisma.user.count();
    if (count === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await this.prisma.user.create({
        data: {
          email: 'admin@arzooman.com',
          passwordHash: hashedPassword,
          role: 'admin',
        },
      });
      console.log('Seeded default admin user via Prisma: admin@arzooman.com / admin123');
    }
  }

  async login(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { email: user.email, role: user.role },
    };
  }
}
