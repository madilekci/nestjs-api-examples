import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get('DATABASE_URL')
                }
            }
        });
    }

    // tear down logic for end to end tests
    cleanUp() {
        return this.$transaction([
            this.bookmark.deleteMany(),
            this.user.deleteMany()
        ]);
    }

}
