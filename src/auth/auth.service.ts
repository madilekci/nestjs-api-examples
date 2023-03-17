import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {

    }

    async signup(dto: AuthDto) {
        // hash password
        const hash = await argon.hash(dto.password);

        // save the user into db
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash: hash
            },
            // select: {
            //     id: true,
            //     email: true,
            //     created_at: true,
            // }
        });

        delete user.hash;

        // return the saved user

        return user;
    }

    signIn() {
        return {msg: 'signin',};
    }

}