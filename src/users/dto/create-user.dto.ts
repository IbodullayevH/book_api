export class CreateUserDto {
    username: string;
    email: string;
    password_hash: string;
    created_at?: Date;
}
