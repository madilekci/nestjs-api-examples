import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService ) {}

    @Post('signup')
    signup( @Body() dto: AuthDto ) {
        return this.authService.signup(dto);
    }

    @Post('signin')
    signIn() {
        return this.authService.signIn();
    }
}