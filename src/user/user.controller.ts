import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { GetUser } from '../auth/decorator';
import { JWTGuard } from '../auth/guard';

@UseGuards(JWTGuard)
@Controller('users')
export class UserController {
    @Get('me')
    getMe(@GetUser() user: User ) {
        console.log('User :', user);
        return user.email;
    }

    @Patch()
    editUser(@GetUser() user: User) {}
}
