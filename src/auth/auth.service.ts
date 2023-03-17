import { Injectable } from '@nestjs/common';
import { User, Bookmark } from '@prisma/client'

@Injectable({})
export class AuthService {

    signIn() {
        return {msg: 'signin',};
    }

    signup() {
        return 'This is the response from signup';
    }

}