import { PrismaService } from './../src/prisma/prisma.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { Test } from '@nestjs/testing';

describe('app e2e', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
            }),
        );

        await app.init();
        prisma = app.get(PrismaService);
        await prisma.cleanUp();
    });

    describe('Auth', () => {
        describe('Sign up', () => {
            it.todo('should sign up');
        });
        describe('Sign in', () => {
          it.todo('should sign in');
        });
    });

    describe('User', () => {
        describe('Get Me', () => {});
        describe('Edit user', () => {});
    });

    describe('Bookmarks', () => {
        describe('Create bookmark', () => {});
        describe('Get bookmarks', () => {});
        describe('Get one bookmark', () => {});

        describe('Update bookmark', () => {});
        describe('Delete bookmark', () => {});
    });

    afterAll(() => {
        app.close();
    });
});
