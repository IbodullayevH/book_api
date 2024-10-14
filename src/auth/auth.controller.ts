import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

    @Post('login')
    async login(@Body('email') email: string, @Body('password') password: string) {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            return { success: false, message: 'User not found' };
        }
                
        const isValidPassword = await this.authService.verifyPassword(password, user.password_hash);
        if (!isValidPassword) {
            return 'Invalid password'
        }

        if (!user || !isValidPassword) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.generateToken(user);
    }


}
