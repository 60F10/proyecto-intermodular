import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    /**
     * Obtiene todos los usuarios activos
     */
    async findAll(): Promise<User[]> {
        return this.usersRepository.find({
            where: { isActive: true },
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Obtiene un usuario por su ID
     * @param id - UUID del usuario
     * @throws NotFoundException si el usuario no existe
     */
    async findOne(id: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        return user;
    }

    /**
     * Busca un usuario por email (incluyendo passwordHash para auth)
     * @param email - Email del usuario
     */
    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { email },
        });
    }
}
