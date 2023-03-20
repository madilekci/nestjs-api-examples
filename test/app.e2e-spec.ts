import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';

import { PrismaService } from './../src/prisma/prisma.service';
import { AppModule } from './../src/app.module';
import { AuthDto } from './../src/auth/dto/auth.dto';

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

        await app.listen(3002);
        pactum.request.setBaseUrl('http://localhost:3002');
    });

    describe('Auth', () => {
        const dto: AuthDto = {
            email: 'email@example.com',
            password: '123test!++test123',
        };
        describe('Sign up', () => {
            it('should throw if email empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody({ ...dto, email: '' })
                    .expectStatus(400);
            });

            it('should throw if password empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody({ ...dto, password: '' })
                    .expectStatus(400);
            });

            it('should throw if no body provided', () => {
                return pactum.spec().post('/auth/signup').expectStatus(400);
            });
            it('should sign up', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody(dto)
                    .expectStatus(201);
            });
        });
        describe('Sign in', () => {
            it('should throw if email empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody({ ...dto, email: '' })
                    .expectStatus(400);
            });

            it('should throw if password empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody({ ...dto, password: '' })
                    .expectStatus(400);
            });

            it('should throw if no body provided', () => {
                return pactum.spec().post('/auth/signin').expectStatus(400);
            });

            it('should sign in', () => {
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody(dto)
                    .expectStatus(200)
                    .stores('userAccessToken', 'access_token');
            });
        });
    });

    describe('User', () => {
        describe('Get Me', () => {
          it('should get current user', () => {
            return pactum
                    .spec()
                    .get('/users/me')
                    .withHeaders('Authorization', 'Bearer $S{userAccessToken}')
                    .expectStatus(200);
          });
        });
        describe('Edit user', () => {
            it('should update user', () => {
                const dto = {
                    firstName: 'Vladimir',
                    email: 'updated-user@example.com',
                }
                return pactum
                    .spec()
                    .patch('/users')
                    .withHeaders('Authorization', 'Bearer $S{userAccessToken}')
                    .withBody(dto)
                    .inspect()
                    .expectBodyContains(dto.firstName)
                    .expectBodyContains(dto.email)
                    .expectStatus(200);
            });
        });
    });

    describe('Bookmarks', () => {
        describe('Create bookmark', () => {});
        describe('Get bookmarks', () => {});
        describe('Get bookmark by id', () => {});

        describe('Update bookmark by id', () => {});
        describe('Delete bookmark by id', () => {});
    });

    afterAll(() => {
        app.close();
    });
});
