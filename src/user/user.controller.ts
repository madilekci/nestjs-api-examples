import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UserController {
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getMe(@Req() req: Request ) {
        console.log('User authenticated : ', req.user);

        return req.user;
    }
}
