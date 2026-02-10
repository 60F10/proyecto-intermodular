import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Valida que el usuario existe y la contraseña coincide
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && user.isActive) {
      // Comparación real con bcryptjs
      const isMatch = await bcrypt.compare(pass, user.passwordHash);
      if (isMatch) {
        // Extraemos passwordHash para no devolverlo jamás
        const { passwordHash, ...result } = user;
        return result;
      }
    }
    return null;
  }

  /**
   * Genera el token JWT tras un login exitoso
   */
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  /**
   * Registro de nuevos usuarios (opcional, si quieres centralizarlo aquí)
   */
  async register(registrationData: any) {
    return this.usersService.create(registrationData);
  }
}