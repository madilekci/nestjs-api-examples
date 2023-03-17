import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {

    signIn() {
        return {msg: 'signin',};
    }

    signup() {
        return 'This is the response from signup';
    }

}