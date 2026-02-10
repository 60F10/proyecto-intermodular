import { 
  Controller, 
  Request, 
  Post, 
  UseGuards, 
  Get, 
  Body, 
  UseInterceptors, 
  ClassSerializerInterceptor 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
// Este interceptor es clave para que NO se vea el passwordHash en la respuesta
@UseInterceptors(ClassSerializerInterceptor) 
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    async register(@Body() createUserDto: any) {
        return this.authService.register(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Request() req) {
        return req.user;
    }
}