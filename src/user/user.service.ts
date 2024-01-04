import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async editUser(id: number, editDto: EditUserDto) {
    const editedUser = await this.prismaService.user.update({
      where: {
        id: +id,
      },
      data: {
        ...editDto,
        updatedAt: new Date(),
      },
    });

    delete editedUser.hash;
    return editedUser;
  }
}
