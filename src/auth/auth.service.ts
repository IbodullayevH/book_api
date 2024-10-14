import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {

    async verifyPassword(password: string, password_hash: string): Promise<boolean> {
        return await bcrypt.compare(password, password_hash);
    }
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService, // JWT token uchun
    ) { }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { email } });
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password_hash))) {
            const { password_hash, ...result } = user;
            return result;
        }
        return null;
    }



    async register(createUserDto: CreateUserDto): Promise<{ success: boolean, message: string, data?: Partial<CreateUserDto> }> {
        const { username, email, password_hash, role } = createUserDto;
        const roleValue = (!role || role.trim() === '') ? 'user' : role;

        if (role.toLowerCase().trim() === 'admin') {
            // Barcha adminlar sonini topish
            let checkCountAdmins = await this.userRepository.count({
                where: { role: 'admin' }
            });

            if (checkCountAdmins >= 1) {
                return {
                    success: false,
                    message: 'Too many admins already. Cannot create another admin.',
                };
            }
        }

        let existUser = await this.userRepository.findOne({
            where: { email, username }
        });


        if (existUser) {
            return {
                success: false,
                message: 'User already exists',
            };
        }

        const hashedPassword = await bcrypt.hash(password_hash, 10);
        const newUser = this.userRepository.create({
            username,
            email,
            password_hash: hashedPassword,
            role: roleValue
        });

        let savedNewUser = await this.userRepository.save(newUser);
        const { password_hash: _passwordHash, ...userWithoutPassword } = savedNewUser

        return {
            success: true,
            message: `Successfully created new user`,
            data: userWithoutPassword,
        };
    }


    async generateToken(user: User): Promise<{ success: boolean, message: string, token: string }> {
        const payload = { username: user.username, sub: user.id, role: user.role };
        let access_token = this.jwtService.sign(payload);

        return {
            success: true,
            message: "Successfully generated access_token",
            token: access_token
        };
    }

}
