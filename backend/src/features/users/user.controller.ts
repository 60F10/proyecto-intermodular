import {
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    /**
     * GET /users
     * Obtiene todos los usuarios activos
     */
    @Get()
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    /**
     * GET /users/:id
     * Obtiene un usuario por su ID
     */
    @Get(':id')
    async findOne(
        @Param('id', new ParseUUIDPipe()) id: string,
    ): Promise<User> {
        return this.usersService.findOne(id);
    }
}
