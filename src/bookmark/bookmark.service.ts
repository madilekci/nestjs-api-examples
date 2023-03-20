import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService) {}

    async createBookmark(userId: number, dto: CreateBookmarkDto) {
        const bookmark = await this.prisma.bookmark.create({
            data: {
                userId: userId,
                ...dto
            }
        });
        return bookmark;
    }

    getBookmarks(userId: number) {
        return this.prisma.bookmark.findMany({
            where: {
                userId
            }
        })
    }

    getBookmarkById(userId: number, bookmarkId: number) {
        return this.prisma.bookmark.findFirst({
            where: {
                userId,
                id: bookmarkId
            }
        })
    }

    async editBookmark(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
        // get the bookmark by id
        const bookmark = await this.prisma.bookmark.findFirst({
            where: {
                id: bookmarkId
            }
        })

        // check if user owns the bookmark
        if (!bookmark || bookmark.userId !== userId) {
            throw new ForbiddenException('Access to resource is denied');
        }

        return this.prisma.bookmark.update({
            where: {
                id: bookmark.id
            },
            data: {
                ...dto
            }
        });
    }

    async deleteBookmark(userId: number, bookmarkId: number) {
        // get the bookmark by id
        const bookmark = await this.prisma.bookmark.findFirst({
            where: {
                id: bookmarkId
            }
        })

        // check if user owns the bookmark
        if (!bookmark || bookmark.userId !== userId) {
            throw new ForbiddenException('Access to resource is denied');
        }

        return this.prisma.bookmark.delete({
            where: {
                id: bookmark.id
            }
        });
    }
}
