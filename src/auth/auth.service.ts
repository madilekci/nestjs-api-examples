import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) {}

    async signup(dto: AuthDto) {
        // hash password
        const hash = await argon.hash(dto.password);

        try {
            // save the user into db
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash: hash,
                },
                // select: {
                //     id: true,
                //     email: true,
                //     created_at: true,
                // }
            });

            delete user.hash;

            // return the saved user
            return this.signToken(user.id, user.email);

        } catch (error) {
            console.log(error instanceof PrismaClientKnownRequestError);
            // catch any duplication errors
            if (error.code === 'P2002') {
                throw new ForbiddenException('Credentials are already in use');
            }
            throw error;
        }
    }

    async signIn(dto: AuthDto) {
        // find the user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        // if user not found throw an exception
        if (!user) {
            throw new ForbiddenException('Credentials incorrect');
        }

        // compare the password
        const pwMatches = await argon.verify(user.hash, dto.password);

        // if password is not correct throw an exception
        if (!pwMatches) {
            throw new ForbiddenException('Credentials incorrect');
        }

        // send back the user
        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email,
        }

        const secret = this.config.get('JWT_SECRET_KEY')

        const token = await this.jwt.signAsync(payload, {
            secret: secret,
            expiresIn: '15m',
        });

        return {
            access_token: token,
        }
    }
}
