import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';

import { PrismaService } from './../src/prisma/prisma.service';
import { AppModule } from './../src/app.module';
import { AuthDto } from './../src/auth/dto/auth.dto';
import { CreateBookmarkDto, EditBookmarkDto } from './../src/bookmark/dto';

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

    describe('Bookmarks', () => {
      describe('Get empty bookmarks', () => {
        it('should get bookmarks', () => {
          return pactum
            .spec()
            .get('/bookmarks')
            .withHeaders({
              Authorization: 'Bearer $S{userAccessToken}',
            })
            .expectStatus(200)
            .expectBody([]);
        });
      });

      describe('Create bookmark', () => {
        const dto: CreateBookmarkDto = {
          title: 'First Bookmark',
          link: 'https://www.youtube.com/watch?v=d6WC5n9G_sM',
        };
        it('should create bookmark', () => {
          return pactum
            .spec()
            .post('/bookmarks')
            .withHeaders({
              Authorization: 'Bearer $S{userAccessToken}',
            })
            .withBody(dto)
            .expectStatus(201)
            .stores('bookmarkId', 'id');
        });
      });

      describe('Get bookmarks', () => {
        it('should get bookmarks', () => {
          return pactum
            .spec()
            .get('/bookmarks')
            .withHeaders({
              Authorization: 'Bearer $S{userAccessToken}',
            })
            .expectStatus(200)
            .expectJsonLength(1);
        });
      });

      describe('Get bookmark by id', () => {
        it('should get bookmark by id', () => {
          return pactum
            .spec()
            .get('/bookmarks/{id}')
            .withPathParams('id', '$S{bookmarkId}')
            .withHeaders({
              Authorization: 'Bearer $S{userAccessToken}',
            })
            .expectStatus(200)
            .expectBodyContains('$S{bookmarkId}');
        });
      });

      describe('Edit bookmark by id', () => {
        const dto: EditBookmarkDto = {
          title:
            'Kubernetes Course - Full Beginners Tutorial (Containerize Your Apps!)',
          description:
            'Learn how to use Kubernetes in this complete course. Kubernetes makes it possible to containerize applications and simplifies app deployment to production.',
        };
        it('should edit bookmark', () => {
          return pactum
            .spec()
            .patch('/bookmarks/{id}')
            .withPathParams('id', '$S{bookmarkId}')
            .withHeaders({
              Authorization: 'Bearer $S{userAccessToken}',
            })
            .withBody(dto)
            .expectStatus(200)
            .expectBodyContains(dto.title)
            .expectBodyContains(dto.description);
        });
      });

      describe('Delete bookmark by id', () => {
        it('should delete bookmark', () => {
          return pactum
            .spec()
            .delete('/bookmarks/{id}')
            .withPathParams('id', '$S{bookmarkId}')
            .withHeaders({
              Authorization: 'Bearer $S{userAccessToken}',
            })
            .expectStatus(204);
        });

        it('should get empty bookmarks', () => {
          return pactum
            .spec()
            .get('/bookmarks')
            .withHeaders({
              Authorization: 'Bearer $S{userAccessToken}',
            })
            .expectStatus(200)
            .expectJsonLength(0);
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

    afterAll(() => {
        app.close();
    });
});
