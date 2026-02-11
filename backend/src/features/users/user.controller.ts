import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  Patch,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

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

    /**
     * PATCH /users/:id
     * Actualiza un usuario (campos parciales)
     */
    @ApiOperation({ summary: 'Actualizar usuario por ID (parcial)' })
    @ApiResponse({ status: 200, description: 'Usuario actualizado', type: User })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    @ApiResponse({ status: 409, description: 'Email ya en uso' })
    @Patch(':id')
    async update(
      @Param('id', new ParseUUIDPipe()) id: string,
      @Body() dto: UpdateUserDto,
    ): Promise<User> {
      return this.usersService.update(id, dto as Partial<User>)
    }
}
