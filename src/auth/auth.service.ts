import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {

    }

    async signup(dto: AuthDto) {
        // hash password
        const hash = await argon.hash(dto.password);

        try {
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
        } catch (error) {
            console.log(error instanceof PrismaClientKnownRequestError );
            // catch any duplication errors
            if (error.code === 'P2002') {
                throw new ForbiddenException('Credentials are already in use');
            }
            throw error;
        }
    }

    signIn() {
        return {msg: 'signin',};
    }

}