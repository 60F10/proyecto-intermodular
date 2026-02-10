import {
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    /**
     * GET /users
     * Obtiene todos los usuarios activos
     */
    @ApiOperation({ summary: 'Obtener todos los usuarios activos' })
    @ApiResponse({
      status: 200,
      description: 'Lista de usuarios activos',
      type: [User],
    })
    @Get()
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    /**
     * GET /users/:id
     * Obtiene un usuario por su ID
     */
    @ApiOperation({ summary: 'Obtener usuario por ID' })
    @ApiParam({
      name: 'id',
      description: 'UUID del usuario',
      format: 'uuid',
    })
    @ApiResponse({
      status: 200,
      description: 'Usuario encontrado',
      type: User,
    })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    @Get(':id')
    async findOne(
        @Param('id', new ParseUUIDPipe()) id: string,
    ): Promise<User> {
        return this.usersService.findOne(id);
    }
}
