export class CreateUserDto {
    username: string;
    email: string;
    password_hash: string;
    role?: string = 'user'; 
    createdAt?: Date
}
