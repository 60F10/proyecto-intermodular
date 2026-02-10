import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../../common/dto/paginated-response.interface';
import { InventoryService } from './inventory.service';
import { InventoryMovement } from './entities/inventory-movement.entity';
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto';

@ApiTags('Inventory')
@Controller('inventory')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @ApiOperation({ summary: 'Obtener todos los movimientos (ADMIN)' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Get()
  async findAll(
    @Query() paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<InventoryMovement>> {
    return this.inventoryService.findAllPaginated(paginationDto);
  }

  @ApiOperation({ summary: 'Obtener movimiento por ID' })
  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<InventoryMovement> {
    return this.inventoryService.findOne(id);
  }

  @ApiOperation({ summary: 'Obtener movimientos de un producto' })
  @Get('producto/:productoId')
  async findByProducto(
    @Param('productoId', new ParseUUIDPipe()) productoId: string,
    @Query() paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<InventoryMovement>> {
    return this.inventoryService.findByProductoPaginated(
      productoId,
      paginationDto,
    );
  }

  @ApiOperation({ summary: 'Registrar entrada de inventario (ADMIN)' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Post('entrada')
  async recordEntry(
    @Body() body: CreateInventoryMovementDto,
  ): Promise<InventoryMovement> {
    return this.inventoryService.recordEntry(
      body.productoId,
      body.cantidad,
      body.motivo || 'Entrada manual',
      body.usuarioId,
    );
  }

  @ApiOperation({ summary: 'Registrar salida de inventario (ADMIN)' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Post('salida')
  async recordExit(
    @Body() body: CreateInventoryMovementDto,
  ): Promise<InventoryMovement> {
    return this.inventoryService.recordExit(
      body.productoId,
      body.cantidad,
      body.motivo || 'Salida manual',
      body.usuarioId,
    );
  }

  @ApiOperation({ summary: 'Registrar ajuste de inventario (ADMIN)' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @Post('ajuste')
  async recordAdjustment(
    @Body() body: CreateInventoryMovementDto,
  ): Promise<InventoryMovement> {
    return this.inventoryService.recordAdjustment(
      body.productoId,
      body.cantidad,
      body.motivo || 'Ajuste manual',
      body.usuarioId,
    );
  }

  @ApiOperation({ summary: 'Eliminar movimiento (SUPERADMIN)' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.inventoryService.delete(id);
  }
}
