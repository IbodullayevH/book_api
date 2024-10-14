import { forwardRef, Module } from '@nestjs/common'; 
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Order } from 'src/orders/entities/order.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { UsersModule } from 'src/users/users.module';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Order]),
        JwtModule.register({
            secret: 'my-secret',
            signOptions: { expiresIn: '1h' },
        }),
        OrdersModule,
        forwardRef(() => UsersModule) // forwardRef dan foydalaning
    ],
    providers: [AuthService, JwtAuthGuard],
    controllers: [AuthController],
    exports: [AuthService], // AuthService ni eksport qiling
})
export class AuthModule {}
