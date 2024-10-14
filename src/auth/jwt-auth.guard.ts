import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = request.headers['authorization']?.split(' ')[1];
        // console.log(token);
        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        try {
            const payload = this.jwtService.verify(token, { secret: 'my-secret' });
            // console.log(payload);            
            const user = await this.usersService.findById(parseInt(payload.sub));
            if (!user) {
                throw new UnauthorizedException('Not found');
            }
            request.user = user;
            return true;
        } catch (error) {
            // console.error('Error verifying token', error);
            throw new UnauthorizedException('Invalid token');
        }
    }
}
