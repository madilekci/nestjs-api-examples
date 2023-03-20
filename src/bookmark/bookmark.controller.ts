import { BookmarkService } from './bookmark.service';
import { Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JWTGuard } from '../auth/guard';
import { GetUser } from 'src/auth/decorator';

@UseGuards(JWTGuard)
@Controller('bookmarks')
export class BookmarkController {

    constructor(private bookmarkService: BookmarkService) {}

    @Post()
    createBookmark(@GetUser('id') userId: number){

    }

    @Get()
    getBookmarks(@GetUser('id') userId: number) {

    }

    @Get(':bookmarkId')
    getBookmarksById(
        @GetUser('id') userId: number,
        @Param('bookmarkId', ParseIntPipe) bookmarkId: number
        ) {

    }

    @Patch()
    editBookmark(@GetUser('id') userId: number) {

    }

    @Delete()
    deleteBookmark(@GetUser('id') userId: number) {}

}
