import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getUser(@GetUser() user: User) {
    return user;
  }

  @Patch(':id')
  editUser(@Param() params: any, @Body() editUserDto: EditUserDto) {
    return this.userService.editUser(params.id, editUserDto);
  }
}
