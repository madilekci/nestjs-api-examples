import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    'jwt' // this is 'jwt' as default but I still wrote this in order to change it easier if needed
) {
    constructor(
        config: ConfigService,
        private prisma: PrismaService,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // this is false by default to make development easier
            // ignoreExpiration: true,
            secretOrKey: config.get('JWT_SECRET_KEY'),
        });
    }

    async validate(payload: {
        sub: number;
        email: string;
    }) {
        console.log('-- Authenticated --');
        console.log(payload);
        // we can add any additional value here, it will be accessible from the the req.user object
        const user = await this.prisma.user.findUnique({
            where: {
                email: payload.email
            }
        });
        delete user.hash;
        return user;
    }
}