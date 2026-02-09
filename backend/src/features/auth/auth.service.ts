import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);

        // User doesn't exist or password doesn't match
        if (!user || !(await bcrypt.compare(pass, user.passwordHash))) {
            return null;
        }

        // User exists and password is correct, but account is inactive
        if (!user.isActive) {
            throw new ForbiddenException('Tu cuenta está inactiva. Contacta con el administrador.');
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...result } = user;
        return result;
    }

    async login(loginDto: LoginDto) {
        try {
            const user = await this.validateUser(loginDto.email, loginDto.password);
            if (!user) {
                throw new UnauthorizedException('Credenciales inválidas');
            }

            const payload = { sub: user.id, email: user.email, role: user.role };
            return {
                accessToken: this.jwtService.sign(payload),
            };
        } catch (error) {
            // Re-throw ForbiddenException for inactive users
            if (error instanceof ForbiddenException) {
                throw error;
            }
            // For any other error, throw UnauthorizedException
            throw new UnauthorizedException('Credenciales inválidas');
        }
    }
}
