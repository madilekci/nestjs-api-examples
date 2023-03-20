import { EditUserDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async editUser(userId:number, dto: EditUserDto) {
        const user = await this.prisma.user.update({
            where:  {
                id: userId,
            },
            data: {
                ...dto
            }
        })

        delete user.hash;

        return user;
    }
}
