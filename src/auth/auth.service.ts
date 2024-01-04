import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(authDto: AuthDto) {
    if (await this.isUserPresent(authDto.email)) {
      throw new ForbiddenException('Email is already in use');
    }
    const hash = await argon.hash(authDto.password);
    const user = await this.prismaService.user.create({
      data: {
        email: authDto.email,
        hash,
      },
    });
    const token = await this.signToken(user.id, user.email);
    return { token };
  }

  async login(authDto: AuthDto) {
    const user = await this.isUserPresent(authDto.email);
    if (!user) {
      throw new ForbiddenException('Email is incorrect');
    }
    const isPasswordMatched = await argon.verify(user.hash, authDto.password);
    if (!isPasswordMatched) {
      throw new ForbiddenException('Email is incorrect');
    }

    const token = await this.signToken(user.id, user.email);
    return { token };
  }

  private signToken(id: number, email: string) {
    const payload = {
      sub: id,
      email,
    };
    console.log(this.configService.get('JWT_SECRET'));
    return this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  private async isUserPresent(email: string) {
    return this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
  }
}
