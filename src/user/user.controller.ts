import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { GetUser } from '../auth/decorator';
import { JWTGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JWTGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('me')
    getMe(@GetUser() user: User ) {
        console.log('User :', user);
        return user.email;
    }

    @Patch()
    editUser(
        @GetUser('id') userId: number,
        @Body() dto: EditUserDto,
    ) {
        return this.userService.editUser(userId, dto)
    }
}
