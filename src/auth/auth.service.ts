import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
// import { User, Bookmark } from '@prisma/client'

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {

    }

    signIn() {
        return {msg: 'signin',};
    }

    signup() {
        return 'This is the response from signup';
    }

}