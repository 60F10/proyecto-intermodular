import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Patch,
  Delete,
  Query,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../../common/dto/paginated-response.interface';
import { SuppliersService } from './suppliers.service';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@ApiTags('Suppliers')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('suppliers')
@UseInterceptors(ClassSerializerInterceptor)
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  // ─────────────────────────── READ ────────────────────────────

  @ApiOperation({ summary: 'Obtener todos los proveedores con paginación' })
  @ApiResponse({ status: 200, description: 'Lista paginada de proveedores' })
  @Get()
  async findAll(
    @Query() paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<Supplier>> {
    return this.suppliersService.findAllPaginated(paginationDto);
  }

  @ApiOperation({ summary: 'Buscar proveedores por nombre / email / ciudad' })
  @ApiQuery({ name: 'q', required: true, description: 'Texto a buscar' })
  @Get('search')
  async search(@Query('q') query: string): Promise<Supplier[]> {
    return this.suppliersService.search(query ?? '');
  }

  @ApiOperation({ summary: 'Obtener proveedor por ID' })
  @ApiResponse({ status: 200, description: 'Proveedor encontrado', type: Supplier })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Supplier> {
    return this.suppliersService.findOne(id);
  }

  // ─────────────────────────── WRITE (ADMIN+) ────────────────────────────

  @ApiOperation({ summary: 'Crear nuevo proveedor (ADMIN)' })
  @ApiResponse({ status: 201, description: 'Proveedor creado', type: Supplier })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Post()
  async create(@Body() dto: CreateSupplierDto): Promise<Supplier> {
    return this.suppliersService.create(dto);
  }

  @ApiOperation({ summary: 'Actualizar proveedor completo (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Proveedor actualizado', type: Supplier })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateSupplierDto,
  ): Promise<Supplier> {
    return this.suppliersService.update(id, dto);
  }

  @ApiOperation({ summary: 'Actualizar campos del proveedor (ADMIN)' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Patch(':id')
  async patch(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateSupplierDto,
  ): Promise<Supplier> {
    return this.suppliersService.update(id, dto);
  }

  @ApiOperation({ summary: 'Desactivar proveedor (soft delete) (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Proveedor desactivado' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<{ message: string }> {
    return this.suppliersService.remove(id);
  }

  @ApiOperation({ summary: 'Eliminar proveedor definitivamente (SUPERADMIN)' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @Delete(':id/hard')
  async hardDelete(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<{ message: string }> {
    return this.suppliersService.hardDelete(id);
  }
}
