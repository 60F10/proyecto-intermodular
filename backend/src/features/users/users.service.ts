import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from '../../common/enums/role.enum';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Crea un usuario aplicando hash a la contraseña
   */
  async create(userData: Partial<User> & { password?: string }): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ 
      where: { email: userData.email } 
    });
    
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.passwordHash = await bcrypt.hash(userData.password, salt);
      delete userData.password; // Limpieza por seguridad
    }

    if (!userData.role) {
      userData.role = UserRole.USER;
    }

    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  /**
   * Método crítico para Auth: debe incluir passwordHash explícitamente
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      // Obligamos a traer el hash de la DB aunque esté excluido en la entidad
      select: ['id', 'email', 'passwordHash', 'role', 'isActive', 'nombre'],
    });
  }
}