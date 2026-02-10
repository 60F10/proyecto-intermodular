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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
// Este interceptor es clave para que NO se vea el passwordHash en la respuesta
@UseInterceptors(ClassSerializerInterceptor) 
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiOperation({ summary: 'Login de usuario' })
    @ApiResponse({
      status: 200,
      description: 'Login exitoso, devuelve JWT token',
      schema: {
        example: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @ApiOperation({ summary: 'Registrar nuevo usuario' })
    @ApiResponse({
      status: 201,
      description: 'Usuario registrado exitosamente',
    })
    @ApiResponse({ status: 400, description: 'Email ya existe' })
    @Post('register')
    async register(@Body() createUserDto: any) {
        return this.authService.register(createUserDto);
    }

    @ApiBearerAuth('jwt')
    @ApiOperation({ summary: 'Obtener perfil del usuario actual' })
    @ApiResponse({
      status: 200,
      description: 'Datos del usuario autenticado',
    })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Request() req) {
        return req.user;
    }
}