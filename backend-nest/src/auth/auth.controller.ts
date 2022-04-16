import { Controller, Post, Body, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Role } from 'src/users/enums/role';
import { UserLoginDto } from './dto/user-login.dto';

@Controller('api/v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('login')
    async login(@Body() userLoginRequest: UserLoginDto, @Response() res) {
        const validateUser = await this.authService.validateUser(userLoginRequest.username, userLoginRequest.password);
        if(validateUser === null) {
            return res.status(400).json({
                message: 'Username or password is incorrect'
            })
        }
        return res.status(200).json(this.authService.login(validateUser));
    }

    @Post('register')
    async register(@Body() userRegisterRequest: CreateUserDto) {
        userRegisterRequest.role = Role.CUSTOMER;
        return this.authService.register(userRegisterRequest);
    }
}
